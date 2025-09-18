import Assert from './assert'
import Expect from './expect'
import Logger from './info/logger'
import Reporter from './info/reporter'
import type { Func } from './types/generic'
import { race, timer } from './utils'

export type RunnerConfig = {
  id?: number
  timeout?: number // ms
  parent?: Runner | null
  logger?: Logger
  reporter?: Reporter
}

export type BaseCallbackParams = {
  log: InstanceType<typeof Logger>['log']
}

export type CallbackParams = {
  describe: BaseCallbackParams &
    Pick<
      InstanceType<typeof Runner>,
      | 'describe'
      | 'test'
      | 'it'
      | 'beforeEach'
      | 'afterEach'
      | 'beforeAll'
      | 'afterAll'
    >
  test: BaseCallbackParams & {
    expect: <T>(value: T) => InstanceType<typeof Expect<T>>
    assert: InstanceType<typeof Assert>
  }
}

export type HookParams = {
  beforeEach: BaseCallbackParams
  afterEach: BaseCallbackParams
  beforeAll: BaseCallbackParams
  afterAll: BaseCallbackParams
}

export type Job = {
  [K in keyof CallbackParams]: {
    type: K
    description: string
    cb: Func<CallbackParams[K], any>
  }
}[keyof CallbackParams]

export default class Runner {
  private readonly id: number
  private readonly timeout: number
  private readonly parent: Runner | null

  private readonly logger: Logger
  private readonly reporter: Reporter

  private jobs: Array<Job> = []

  private beforeAlls: Array<Func<HookParams['beforeAll'], any>> = []
  private afterAlls: Array<Func<HookParams['afterAll'], any>> = []

  private beforeEachs: Array<Func<HookParams['beforeEach'], any>> = []
  private afterEachs: Array<Func<HookParams['afterEach'], any>> = []

  constructor({
    id = 0,
    timeout = 5000,
    parent = null,
    logger = new Logger(),
    reporter = new Reporter(),
  }: RunnerConfig = {}) {
    this.id = id
    this.timeout = timeout
    this.parent = parent

    this.logger = logger
    this.reporter = reporter

    if (!this.id) {
      queueMicrotask(async () => {
        // Setup
        const handleUncaughtException = (er: any) => {
          this.reporter.catch('Uncaught Exception', er)
        }
        process.on('uncaughtException', handleUncaughtException)
        // Run the tree of tests
        await this.run()
        // Show the report
        const { fail } = this.reporter.report()
        // Teardown
        process.off('uncaughtException', handleUncaughtException)
        return process.exit(!fail ? 0 : 1)
      })
    }
  }

  run = async () => {
    await this.runBeforeAll()

    for (const { type, description, cb } of this.jobs) {
      if (type === 'describe') await this.runDescribe(description, cb)
      else if (type === 'test') await this.runTest(description, cb)
      else throw new Error('Invalid job.')
    }

    await this.runAfterAll()
  }

  /**
   * Describe block
   */

  describe = <T>(
    description: string,
    cb: Func<CallbackParams['describe'], T> = () => {},
  ) => {
    this.jobs.push({
      type: 'describe',
      description,
      cb,
    })
  }

  private runDescribe = async <T>(
    description: string,
    cb: Func<CallbackParams['describe'], T> = () => {},
  ) => {
    this.logger.blue(description)
    const groupEnd = this.logger.group()

    const runner = new Runner({
      id: this.id + 1,
      timeout: this.timeout,
      parent: this,
      logger: this.logger,
      reporter: this.reporter,
    })

    await cb({
      log: runner.logger.log,
      describe: runner.describe,
      test: runner.test,
      it: runner.it,
      beforeEach: runner.beforeEach,
      afterEach: runner.afterEach,
      beforeAll: runner.beforeAll,
      afterAll: runner.afterAll,
    })
    await runner.run()

    groupEnd()
  }

  /**
   * Test block
   */

  test = <T>(
    description: string,
    cb: Func<CallbackParams['test'], T> = () => {},
  ) => {
    this.jobs.push({
      type: 'test',
      description,
      cb,
    })
  }

  private runTest = async <T>(
    description: string,
    cb: Func<CallbackParams['test'], T> = () => {},
  ) => {
    await this.runBeforeEach()

    const groupEnd = this.logger.group()
    const timerEnd = timer()

    try {
      const expect = <T>(value: T) => new Expect(value, this.logger)
      const assert = new Assert(this.logger)

      await race(
        async () => await cb({ log: this.logger.log, expect, assert }),
        this.timeout,
        `Cannot complete the task in ${this.timeout}ms.`,
      )

      groupEnd()
      const { message } = timerEnd()

      this.logger.green(description, message)
      this.reporter.pass()
    } catch (er) {
      groupEnd()

      this.logger.red(description)
      this.reporter.catch(description, er)
    }

    await this.runAfterEach()
  }

  /**
   * It block (test alias)
   */

  it = this.test

  /**
   * Before all
   */

  beforeAll = (cb?: Func<HookParams['beforeAll'], any>) => {
    if (cb) this.beforeAlls.push(cb)
  }

  private runBeforeAll = async () => {
    for (const cb of this.beforeAlls) {
      await cb({ log: this.logger.log })
    }
  }

  /**
   * After all
   */

  afterAll = (cb?: Func<HookParams['afterAll'], any>) => {
    if (cb) this.afterAlls.push(cb)
  }

  private runAfterAll = async () => {
    for (const cb of this.afterAlls) {
      await cb({ log: this.logger.log })
    }
  }

  /**
   * Before each
   */

  beforeEach = (cb?: Func<HookParams['beforeEach'], any>) => {
    if (cb) this.beforeEachs.push(cb)
  }

  runBeforeEach = async () => {
    await this.parent?.runBeforeEach()
    for (const cb of this.beforeEachs) {
      await cb({ log: this.logger.log })
    }
  }

  /**
   * After each
   */

  afterEach = (cb?: Func<HookParams['afterEach'], any>) => {
    if (cb) this.afterEachs.push(cb)
  }

  runAfterEach = async () => {
    await this.parent?.runAfterEach()
    for (const cb of this.afterEachs) {
      await cb({ log: this.logger.log })
    }
  }
}
