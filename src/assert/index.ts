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

  instanceOf = <T>(
    value: T,
    constructor: Function,
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
