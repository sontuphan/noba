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

  isOk = <T>(value: T, msg?: string) => {
    if (!!value) return true
    throw new Error(msg || this.expect(value, 'to be', 'a truthy value'))
  }

  isNotOk = <T>(value: T, msg?: string) => {
    if (!value) return true
    throw new Error(msg || this.expect(value, 'not to be', 'a truthy value'))
  }

  equal = <T>(actual: T, expected: T, msg?: string) => {
    if (actual == expected) return true
    throw new Error(msg || this.expect(actual, 'to equal', expected))
  }

  notEqual = <T>(actual: T, expected: T, msg?: string) => {
    if (actual != expected) return true
    throw new Error(msg || this.expect(actual, 'not to equal', expected))
  }

  strictEqual = <T>(actual: T, expected: T, msg?: string) => {
    if (actual === expected) return true
    throw new Error(msg || this.expect(actual, 'to strict equal', expected))
  }

  deepEqual = (a: any, b: any, msg?: string) => {
    msg = msg || this.expect(a, 'to deep equal', b)

    if (a === b) return true

    if (
      typeof a !== 'object' ||
      typeof b !== 'object' ||
      a === null ||
      b === null
    ) {
      throw new Error(msg)
    }

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) {
      throw new Error(msg)
    }

    for (const key of keysA) {
      if (!keysB.includes(key) || !this.deepEqual(a[key], b[key], msg)) {
        throw new Error(msg)
      }
    }

    return true
  }

  instanceOf = <T>(
    value: unknown,
    constructor: new (...args: any[]) => T,
    msg?: string,
  ): value is T => {
    if (value instanceof constructor) return true
    throw new Error(msg || this.expect(value, 'to instance of', constructor))
  }

  notInstanceOf = <T>(value: T, constructor: Function, msg?: string) => {
    if (!(value instanceof constructor)) return true
    throw new Error(
      msg ||
        this.expect(
          value.constructor.name,
          'not to instance of',
          constructor.name,
        ),
    )
  }
}
