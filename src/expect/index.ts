import Reporter from '../reporter'
import Not from './not'
import To from './to'

export default class Expect<T> {
  constructor(public readonly expect: T, private readonly reporter: Reporter) {}

  get not() {
    return new Not<T>(this.expect, this.reporter)
  }

  get to() {
    return new To<T>(this.expect, this.reporter)
  }

  toBe = (actual: T) => {
    if (this.expect === actual) return

    this.reporter.green('- Expect:', this.expect)
    this.reporter.red('- Actual:', actual)
    throw new Error(`Expect ${this.expect} equals to ${actual}`)
  }

  toEqual = (actual: T) => {
    this.to.equal(actual)
  }
}
