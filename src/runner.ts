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
    Pick<InstanceType<typeof Runner>, 'describe' | 'test'>
  test: BaseCallbackParams
}

export type JobType = keyof CallbackParams

export type Job = {
  [K in JobType]: {
    type: K
    description: string
    cb: Func<CallbackParams[K], any>
  }
}[JobType]

export default class Runner {
  private readonly id: number
  private readonly timeout: number
  private readonly parent: Runner | null
  private readonly logger: Logger

  private jobs: Array<Job> = []

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
        })

        await runner.run()

        groupEnd()
        continue
      }

      if (type === 'test') {
        this.logger.green(description)
        const groupEnd = this.logger.group()

        await cb({ log: this.logger.log })

        groupEnd()
        continue
      }

      throw new Error('Invalid job.')
    }
  }

  describe = async <T>(
    description: string,
    cb: Func<CallbackParams['describe'], T> = () => {},
  ) => {
    this.jobs.push({
      type: 'describe',
      description,
      cb,
    })
  }

  test = async <T>(
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
}
