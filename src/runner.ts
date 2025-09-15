export type RunnerConfig = {
  timeout?: number // ms
}

export type MaybePromise<T> = void | T | Promise<void | T>

export type Callback<T> = () => MaybePromise<T>

export default class Runner {
  private timeout: number

  constructor({ timeout = 10000 }: RunnerConfig = {}) {
    this.timeout = timeout
  }

  describe = async <T>(description: string, cb: Callback<T> = () => {}) => {
    console.log('describe', description, this.timeout)
    await cb()
  }

  test = async <T>(description: string, cb: Callback<T> = () => {}) => {
    console.log('it', description, this.timeout)
    await cb()
  }

  it = this.test
}
