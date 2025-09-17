import Logger from './info/logger'

export default class Expect<T> {
  constructor(
    public readonly expect: T,
    private readonly logger: Logger = new Logger(),
  ) {}

  toBe = (actual: T) => {
    if (this.expect === actual) return

    this.logger.green('- Expect:', this.expect)
    this.logger.red('- Actual:', actual)
    throw new Error(`Expect ${this.expect} equals to ${actual}`)
  }
}
