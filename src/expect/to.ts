import Reporter from '../reporter'
import Be from './be'

export default class To<T> {
  constructor(
    public readonly expect: T,
    private readonly reporter: Reporter,
    private readonly not = false,
  ) {}

  get infinitive() {
    return this.not ? 'not to' : 'to'
  }

  get be() {
    return new Be(this.not, this.reporter)
  }

  private compare = (value: boolean) => {
    return value === !this.not
  }

  equal = (actual: T) => {
    if (this.compare(this.expect == actual)) return

    this.reporter.green('- Expect:', this.expect)
    this.reporter.red('- Actual:', actual)
    throw new Error(
      `Expect ${this.expect} ${this.infinitive} equals to ${actual}`,
    )
  }
}
