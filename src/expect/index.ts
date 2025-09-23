import Reporter from '../reporter'
import Not from './not'
import To from './to'

export default class Expect<A> {
  constructor(public readonly actual: A, private readonly reporter: Reporter) {}

  get not() {
    return new Not<A>(this.actual, this.reporter)
  }

  get to() {
    return new To<A>(this.actual, this.reporter)
  }

  private expect = <E>(verb: string, expect: E) => {
    this.reporter.green('- Expected:', expect)
    this.reporter.red('- Received:', this.actual)

    return `Expect ${this.actual} ${verb} ${expect}.`
  }

  private _throws = (fn: () => void, message: string | RegExp) => {
    try {
      fn()
      return false
    } catch (error: any) {
      if (typeof message === 'string') return error?.message === message
      if (message instanceof RegExp) return message.test(error?.message)
      return false
    }
  }

  throws = (fn: () => void, message: string | RegExp, msg?: string) => {
    if (this._throws(fn, message)) return true
    throw new Error(
      msg || this.expect('to throw', `an error with message sastifying ${msg}`),
    )
  }

  private _rejects = async (
    fn: () => Promise<void>,
    message: string | RegExp,
  ) => {
    try {
      await fn()
      return false
    } catch (error: any) {
      if (typeof message === 'string') return error?.message === message
      if (message instanceof RegExp) return message.test(error?.message)
      return false
    }
  }

  rejects = async (
    fn: () => Promise<void>,
    message: string | RegExp,
    msg?: string,
  ) => {
    if (await this._rejects(fn, message)) return true
    throw new Error(
      msg ||
        this.expect('to reject', `an error with message sastifying ${msg}`),
    )
  }

  toBe = this.to.be.be
  toBeDefined = this.to.be.defined
  toBeUndefined = this.to.be.undefined
  toBeTruthy = this.to.be.truthy
  toBeFalsy = this.to.be.falsy
  toBeNull = this.to.be.null
  toBeNaN = this.to.be.nan
  toBeOneOf = this.to.be.oneOf
  toBeTypeOf = this.to.be.typeOf
  toBeInstanceOf = this.to.be.instanceOf

  toEqual = this.to.equal
  toContain = this.to.contain
  toHaveLength = this.to.haveLength
}
