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

  fail = (msg: string = 'assertion failed') => {
    throw new Error(msg)
  }

  isOk = <T>(value: T, msg?: string) => {
    if (!!value) return

    throw new Error(msg || this.expect(value, 'to be', 'a truthy value'))
  }

  isNotOk = <T>(value: T, msg?: string) => {
    if (!value) return

    throw new Error(msg || this.expect(value, 'not to be', 'a truthy value'))
  }
}
