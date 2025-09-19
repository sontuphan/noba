import Reporter from '../reporter'

export default class Assert {
  constructor(private readonly reporter: Reporter) {}

  get assert() {
    return new Assert(this.reporter)
  }

  private expect = <A, E>(actual: A, verb: string, expect: E) => {
    this.reporter.green('- Expected:', expect)
    this.reporter.red('- Received:', actual)

    return `Expect ${actual} ${verb} ${expect}.`
  }

  fail = (msg: string = 'assertion failed'): boolean => {
    throw new Error(msg)
  }

  private _isOk = <T>(value: T) => {
    return !!value
  }

  isOk = <T>(value: T, msg?: string) => {
    if (this._isOk(value)) return true
    throw new Error(msg || this.expect(value, 'to be', 'a truthy value'))
  }

  isNotOk = <T>(value: T, msg?: string) => {
    if (!this._isOk(value)) return true
    throw new Error(msg || this.expect(value, 'not to be', 'a truthy value'))
  }

  private _equal = <T>(actual: T, expected: T) => {
    return actual == expected
  }

  equal = <T>(actual: T, expected: T, msg?: string) => {
    if (this._equal(actual, expected)) return true
    throw new Error(msg || this.expect(actual, 'to equal', expected))
  }

  notEqual = <T>(actual: T, expected: T, msg?: string) => {
    if (!this._equal(actual, expected)) return true
    throw new Error(msg || this.expect(actual, 'not to equal', expected))
  }

  private _strictEqual = <T>(actual: T, expected: T) => {
    return actual === expected
  }

  strictEqual = <T>(actual: T, expected: T, msg?: string) => {
    if (this._strictEqual(actual, expected)) return true
    throw new Error(msg || this.expect(actual, 'to strictly equal', expected))
  }

  private _deepEqual = (a: any, b: any) => {
    if (a === b) return true

    if (
      typeof a !== 'object' ||
      typeof b !== 'object' ||
      a === null ||
      b === null
    )
      return false

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false

    for (const key of keysA)
      if (!keysB.includes(key) || !this._deepEqual(a[key], b[key])) return false

    return true
  }

  deepEqual = (a: any, b: any, msg?: string) => {
    if (this._deepEqual(a, b)) return true
    throw new Error(msg || this.expect(a, 'to deeply equal', b))
  }

  notDeepEqual = (a: any, b: any, msg?: string) => {
    if (!this._deepEqual(a, b)) return true
    throw new Error(msg || this.expect(a, 'not to deeply equal', b))
  }

  private _instanceOf = <T>(
    value: unknown,
    constructor: new (...args: any[]) => T,
  ): value is T => {
    return value instanceof constructor
  }

  instanceOf = <T>(
    value: unknown,
    constructor: new (...args: any[]) => T,
    msg?: string,
  ): value is T => {
    if (this._instanceOf(value, constructor)) return true
    throw new Error(
      msg || this.expect(value, 'to be an instance of', constructor),
    )
  }

  notInstanceOf = <T>(
    value: unknown,
    constructor: new (...args: any[]) => T,
    msg?: string,
  ) => {
    if (!this._instanceOf(value, constructor)) return true
    throw new Error(
      msg || this.expect(value, 'not to be an instance of', constructor),
    )
  }

  private _isTrue = <T>(value: T) => {
    return value === true
  }

  isTrue = <T>(value: T, msg?: string) => {
    if (this._isTrue(value)) return true
    throw new Error(msg || this.expect(value, 'to be', true))
  }

  isNotTrue = <T>(value: T, msg?: string) => {
    if (!this._isTrue(value)) return true
    throw new Error(msg || this.expect(value, 'not to be', true))
  }

  private _isFalse = <T>(value: T) => {
    return value === false
  }

  isFalse = <T>(value: T, msg?: string) => {
    if (this._isFalse(value)) return true
    throw new Error(msg || this.expect(value, 'to be', false))
  }

  isNotFalse = <T>(value: T, msg?: string) => {
    if (!this._isFalse(value)) return true
    throw new Error(msg || this.expect(value, 'not to be', false))
  }

  private _isNull = <T>(value: T) => {
    return value === null
  }

  isNull = <T>(value: T, msg?: string) => {
    if (this._isNull(value)) return true
    throw new Error(msg || this.expect(value, 'to be', null))
  }

  isNotNull = <T>(value: T, msg?: string) => {
    if (!this._isNull(value)) return true
    throw new Error(msg || this.expect(value, 'not to be', null))
  }

  private _isUndefined = <T>(value: T) => {
    return value === undefined
  }

  isUndefined = <T>(value: T, msg?: string) => {
    if (this._isUndefined(value)) return true
    throw new Error(msg || this.expect(value, 'to be', undefined))
  }

  isNotUndefined = <T>(value: T, msg?: string) => {
    if (!this._isUndefined(value)) return true
    throw new Error(msg || this.expect(value, 'not to be', undefined))
  }

  private _isNaN = <T>(value: T) => {
    return Number.isNaN(value)
  }

  isNaN = <T>(value: T, msg?: string) => {
    if (this._isNaN(value)) return true
    throw new Error(msg || this.expect(value, 'to be', NaN))
  }

  isNotNaN = <T>(value: T, msg?: string) => {
    if (!this._isNaN(value)) return true
    throw new Error(msg || this.expect(value, 'not to be', NaN))
  }

  private _isExist = <T>(value: T) => {
    return !this._isNull(value) && !this._isUndefined(value)
  }

  isExist = <T>(value: T, msg?: string) => {
    if (this._isExist(value)) return true
    throw new Error(
      msg || this.expect(value, 'not to be', 'null and undefined'),
    )
  }

  isNotExist = <T>(value: T, msg?: string) => {
    if (!this._isExist(value)) return true
    throw new Error(msg || this.expect(value, 'to be', 'null or undefined'))
  }
}
