import process from 'process'
import Assert from './assert'
import Expect from './expect'
import Logger from './reporter'
import Reporter from './reporter'
import type { Func } from './types/generic'
import { race, timer, uuid } from './utils'

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
  private readonly reporter: Reporter

  private jobs: Array<Job> = []

  private beforeAlls: Array<Func<HookParams['beforeAll'], any>> = []
  private afterAlls: Array<Func<HookParams['afterAll'], any>> = []

  private beforeEachs: Array<Func<HookParams['beforeEach'], any>> = []
  private afterEachs: Array<Func<HookParams['afterEach'], any>> = []

  constructor(
    private readonly id: string,
    private readonly timeout: number = 5000,
    private readonly parent: Runner | null = null,
    reporter?: Reporter,
  ) {
    // This instance is created once in main and passed around
    this.reporter = reporter || new Reporter(this.id)

    if (this.isMain) {
      process.nextTick(async () => {
        // Setup
        const handleUncaughtException = (er: any) => {
          this.reporter.catch('Uncaught Exception', er)
        }
        const handleUnhandledRejection = (er: any) => {
          this.reporter.catch('Unhandled Rejection', er)
        }
        process.on('uncaughtException', handleUncaughtException)
        process.on('unhandledRejection', handleUnhandledRejection)
        // Run the tree of tests
        await this.run()
        // Emit the report
        this.reporter.report()
        // Teardown
        process.off('uncaughtException', handleUncaughtException)
        process.off('unhandledRejection', handleUnhandledRejection)
        return process.exit(0)
      })
    }
  }

  get isMain() {
    return this.id === process.env.NOBA_MAIN_ID
  }

  run = async () => {
    try {
      await this.runBeforeAll()
    } catch (er) {
      this.reporter.uncatch('beforeAll', er)
    }

    for (const { type, description, cb } of this.jobs) {
      if (type === 'describe') await this.runDescribe(description, cb)
      if (type === 'test') await this.runTest(description, cb)
    }

    try {
      await this.runAfterAll()
    } catch (er) {
      this.reporter.uncatch('afterAll', er)
    }
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
    const groupEnd = this.reporter.group()

    const runner = new Runner(uuid(), this.timeout, this, this.reporter)

    try {
      await cb({
        log: runner.reporter.log,
        describe: runner.describe,
        test: runner.test,
        it: runner.it,
        beforeEach: runner.beforeEach,
        afterEach: runner.afterEach,
        beforeAll: runner.beforeAll,
        afterAll: runner.afterAll,
      })

      this.reporter.blue(description)
    } catch (er) {
      this.reporter.red(description)
      this.reporter.uncatch(description, er)
    }

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
    try {
      await this.runBeforeEach()
    } catch (er) {
      this.reporter.uncatch('beforeEach', er)
    }

    const groupEnd = this.reporter.group()
    const timerEnd = timer()

    try {
      const expect = <T>(value: T) => new Expect(value, this.reporter)
      const assert = new Assert(this.reporter)

      await race(
        async () => await cb({ log: this.reporter.log, expect, assert }),
        this.timeout,
        `Cannot complete the task in ${this.timeout}ms.`,
      )

      groupEnd()
      const { message } = timerEnd()

      this.reporter.green(description, message)
      this.reporter.pass()
    } catch (er) {
      groupEnd()

      this.reporter.red(description)
      this.reporter.catch(description, er)
    }

    try {
      await this.runAfterEach()
    } catch (er) {
      this.reporter.uncatch('afterEach', er)
    }
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
      await cb({ log: this.reporter.log })
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
      await cb({ log: this.reporter.log })
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
      await cb({ log: this.reporter.log })
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
      await cb({ log: this.reporter.log })
    }
  }
}
