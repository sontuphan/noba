import Reporter from '../reporter'
import Not from './not'
import To from './to'

export default class Expect<A> {
  constructor(public readonly actual: A, private readonly reporter: Reporter) {}

  get not() {
    return new Not(this.actual, this.reporter)
  }

  get to() {
    return new To(this.actual, this.reporter)
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

  toBe = (...args: Parameters<typeof this.to.be>) => this.to.be(...args)
  toBeDefined = (...args: Parameters<typeof this.to.be.defined>) =>
    this.to.be.defined(...args)
  toBeUndefined = (...args: Parameters<typeof this.to.be.undefined>) =>
    this.to.be.undefined(...args)
  toBeTruthy = (...args: Parameters<typeof this.to.be.truthy>) =>
    this.to.be.truthy(...args)
  toBeFalsy = (...args: Parameters<typeof this.to.be.falsy>) =>
    this.to.be.falsy(...args)
  toBeNull = (...args: Parameters<typeof this.to.be.null>) =>
    this.to.be.null(...args)
  toBeNaN = (...args: Parameters<typeof this.to.be.nan>) =>
    this.to.be.nan(...args)
  toBeOneOf = (...args: Parameters<typeof this.to.be.oneOf>) =>
    this.to.be.oneOf(...args)
  toBeTypeOf = (...args: Parameters<typeof this.to.be.typeOf>) =>
    this.to.be.typeOf(...args)
  toBeInstanceOf = (...args: Parameters<typeof this.to.be.instanceOf>) =>
    this.to.be.instanceOf(...args)

  toEqual = (...args: Parameters<typeof this.to.equal>) =>
    this.to.equal(...args)
  toContain = (...args: Parameters<typeof this.to.contain>) =>
    this.to.contain(...args)
  toHaveLength = (...args: Parameters<typeof this.to.haveLength>) =>
    this.to.haveLength(...args)
}
