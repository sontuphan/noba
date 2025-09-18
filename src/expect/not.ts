import Logger from '../info/logger'
import To from './to'

export default class Not<T> {
  constructor(
    public readonly expect: T,
    private readonly logger: Logger = new Logger(),
  ) {}

  get to() {
    return new To(this.expect, this.logger, true)
  }
}
