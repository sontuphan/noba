import Logger from '../info/logger'
import Be from './be'

export default class To<T> {
  constructor(
    public readonly expect: T,
    private readonly logger: Logger = new Logger(),
    private readonly not = false,
  ) {}

  get infinitive() {
    return this.not ? 'not to' : 'to'
  }

  get be() {
    return new Be(this.not)
  }

  private compare = (value: boolean) => {
    return value === !this.not
  }

  equal = (actual: T) => {
    if (this.compare(this.expect == actual)) return

    this.logger.green('- Expect:', this.expect)
    this.logger.red('- Actual:', actual)
    throw new Error(
      `Expect ${this.expect} ${this.infinitive} equals to ${actual}`,
    )
  }
}
