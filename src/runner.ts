import Logger from './logger'
import type { Func } from './types'

export type RunnerConfig = {
  id?: number
  timeout?: number // ms
  parent?: Runner | null
  logger?: Logger
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
      | 'beforeEach'
      | 'afterEach'
      | 'beforeAll'
      | 'afterAll'
    >
  test: BaseCallbackParams
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

  private jobs: Array<Job> = []

  private beforeAlls: Array<Func<HookParams['beforeAll'], any>> = []
  private afterAlls: Array<Func<HookParams['afterAll'], any>> = []

  private beforeEachs: Array<Func<HookParams['beforeEach'], any>> = []
  private afterEachs: Array<Func<HookParams['afterEach'], any>> = []

  constructor({
    id = 0,
    timeout = 10000,
    parent = null,
    logger = new Logger(),
  }: RunnerConfig = {}) {
    this.id = id
    this.timeout = timeout
    this.parent = parent
    this.logger = logger

    if (!this.id) {
      process.nextTick(() => {
        this.run()
      })
    }
  }

  run = async () => {
    await this.runBeforeAll()

    for (const { type, description, cb } of this.jobs) {
      if (type === 'describe') {
        this.logger.blue(description)
        const groupEnd = this.logger.group()

        const runner = new Runner({
          id: this.id + 1,
          timeout: this.timeout,
          parent: this,
          logger: this.logger,
        })

        await cb({
          log: runner.logger.log,
          describe: runner.describe,
          test: runner.test,
          beforeEach: runner.beforeEach,
          afterEach: runner.afterEach,
          beforeAll: runner.beforeAll,
          afterAll: runner.afterAll,
        })
        await runner.run()

        groupEnd()
        continue
      }

      if (type === 'test') {
        this.logger.green(description)
        const groupEnd = this.logger.group()

        await this.runBeforeEach()
        await cb({ log: this.logger.log })
        await this.runAfterEach()

        groupEnd()
        continue
      }

      throw new Error('Invalid job.')
    }

    await this.runAfterAll()
  }

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

  it = this.test

  beforeAll = (cb?: Func<HookParams['beforeAll'], any>) => {
    if (cb) this.beforeAlls.push(cb)
  }
  runBeforeAll = async () => {
    for (const cb of this.beforeAlls) {
      await cb({ log: this.logger.log })
    }
  }

  afterAll = (cb?: Func<HookParams['afterAll'], any>) => {
    if (cb) this.afterAlls.push(cb)
  }
  runAfterAll = async () => {
    for (const cb of this.afterAlls) {
      await cb({ log: this.logger.log })
    }
  }

  beforeEach = (cb?: Func<HookParams['beforeEach'], any>) => {
    if (cb) this.beforeEachs.push(cb)
  }
  runBeforeEach = async () => {
    await this.parent?.runBeforeEach()
    for (const cb of this.beforeEachs) {
      await cb({ log: this.logger.log })
    }
  }

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
