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
      | 'each'
      | 'beforeEach'
      | 'afterEach'
      | 'beforeAll'
      | 'afterAll'
    >
  test: BaseCallbackParams & {
    expect: <T>(value: T) => InstanceType<typeof Expect<T>>
    assert: InstanceType<typeof Assert>
  }
  each: BaseCallbackParams &
    Pick<InstanceType<typeof Runner>, 'describe' | 'test' | 'it'>
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
  private queued: boolean = false

  private beforeAlls: Array<{
    cb: Func<HookParams['beforeAll'], any>
    timeout?: number
  }> = []
  private afterAlls: Array<{
    cb: Func<HookParams['afterAll'], any>
    timeout?: number
  }> = []

  private beforeEachs: Array<{
    cb: Func<HookParams['beforeEach'], any>
    timeout?: number
  }> = []
  private afterEachs: Array<{
    cb: Func<HookParams['afterEach'], any>
    timeout?: number
  }> = []

  constructor(
    private readonly id: string,
    private readonly timeout: number = 5000,
    private readonly parent: Runner | null = null,
    reporter?: Reporter,
  ) {
    // This instance is created once in main and passed around
    this.reporter = reporter || new Reporter(this.id)
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

  private plan = () => {
    if (!this.isMain || this.queued) return

    this.queued = true

    return queueMicrotask(async () => {
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
    })
  }

  /**
   * Describe block
   */

  describe = <O>(
    description: string,
    cb: Func<CallbackParams['describe'], O> = () => {},
  ) => {
    // Register the job
    this.jobs.push({
      type: 'describe',
      description,
      cb,
    })
    // Register the master plan
    this.plan()
  }

  private runDescribe = async <O>(
    description: string,
    cb: Func<CallbackParams['describe'], O> = () => {},
  ) => {
    this.reporter.blue(description)
    const groupEnd = this.reporter.group()

    const runner = new Runner(uuid(), this.timeout, this, this.reporter)

    try {
      await cb({
        log: runner.reporter.log,
        describe: runner.describe,
        test: runner.test,
        it: runner.it,
        each: runner.each,
        beforeEach: runner.beforeEach,
        afterEach: runner.afterEach,
        beforeAll: runner.beforeAll,
        afterAll: runner.afterAll,
      })
    } catch (er) {
      this.reporter.uncatch(description, er)
    }

    await runner.run()

    groupEnd()
  }

  /**
   * Test block
   */

  test = <O>(
    description: string,
    cb: Func<CallbackParams['test'], O> = () => {},
  ) => {
    // Register the job
    this.jobs.push({
      type: 'test',
      description,
      cb,
    })
    // Register the master plan
    this.plan()
  }

  private runTest = async <O>(
    description: string,
    cb: Func<CallbackParams['test'], O> = () => {},
  ) => {
    try {
      await this.runBeforeEach()
    } catch (er) {
      this.reporter.uncatch('beforeEach', er)
    }

    const groupEnd = this.reporter.group()
    const timerEnd = timer()

    try {
      const expect = <A>(value: A) => new Expect(value, this.reporter)
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
   * Each block
   */

  each = async <T, O>(
    args: Array<T>,
    cb: Func<CallbackParams['each'] & { arg: T }, O> = () => {},
  ) => {
    for (const arg of args) {
      await cb({
        log: this.reporter.log,
        describe: this.describe,
        test: this.test,
        it: this.it,
        arg,
      })
    }
  }

  /**
   * Before all
   */

  beforeAll = (cb?: Func<HookParams['beforeAll'], any>, timeout?: number) => {
    if (cb) this.beforeAlls.push({ cb, timeout })
  }

  private runBeforeAll = async () => {
    for (const { cb, timeout } of this.beforeAlls) {
      if (!timeout) await cb({ log: this.reporter.log })
      else
        await race(
          async () => await cb({ log: this.reporter.log }),
          timeout,
          `Cannot complete beforeAll in ${timeout}ms.`,
        )
    }
  }

  /**
   * After all
   */

  afterAll = (cb?: Func<HookParams['afterAll'], any>, timeout?: number) => {
    if (cb) this.afterAlls.push({ cb, timeout })
  }

  private runAfterAll = async () => {
    for (const { cb, timeout } of this.afterAlls) {
      if (!timeout) await cb({ log: this.reporter.log })
      else
        await race(
          async () => await cb({ log: this.reporter.log }),
          timeout,
          `Cannot complete afterAll in ${timeout}ms.`,
        )
    }
  }

  /**
   * Before each
   */

  beforeEach = (cb?: Func<HookParams['beforeEach'], any>, timeout?: number) => {
    if (cb) this.beforeEachs.push({ cb, timeout })
  }

  runBeforeEach = async () => {
    await this.parent?.runBeforeEach()
    for (const { cb, timeout } of this.beforeEachs) {
      if (!timeout) await cb({ log: this.reporter.log })
      else
        await race(
          async () => await cb({ log: this.reporter.log }),
          timeout,
          `Cannot complete afterAll in ${timeout}ms.`,
        )
    }
  }

  /**
   * After each
   */

  afterEach = (cb?: Func<HookParams['afterEach'], any>, timeout?: number) => {
    if (cb) this.afterEachs.push({ cb, timeout })
  }

  runAfterEach = async () => {
    await this.parent?.runAfterEach()
    for (const { cb, timeout } of this.afterEachs) {
      if (!timeout) await cb({ log: this.reporter.log })
      else
        await race(
          async () => await cb({ log: this.reporter.log }),
          timeout,
          `Cannot complete afterAll in ${timeout}ms.`,
        )
    }
  }
}
