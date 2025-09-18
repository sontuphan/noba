import Logger from '../info/logger'
import Not from './not'
import To from './to'

export default class Expect<T> {
  constructor(
    public readonly expect: T,
    private readonly logger: Logger = new Logger(),
  ) {}

  get not() {
    return new Not<T>(this.expect, this.logger)
  }

  get to() {
    return new To<T>(this.expect, this.logger)
  }

  toBe = (actual: T) => {
    if (this.expect === actual) return

    this.logger.green('- Expect:', this.expect)
    this.logger.red('- Actual:', actual)
    throw new Error(`Expect ${this.expect} equals to ${actual}`)
  }

  toEqual = (actual: T) => {
    this.to.equal(actual)
  }
}
