import Logger from 'src/info/logger'

export default class Assert {
  constructor(private readonly logger: Logger = new Logger()) {}

  get assert() {
    return new Assert(this.logger)
  }

  private expect = <A, E>(actual: A, verb: string, expect: E) => {
    this.logger.green('- Expected:', expect)
    this.logger.red('- Received:', actual)

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
