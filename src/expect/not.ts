import Reporter from '../reporter'
import To from './to'

export default class Not<T> {
  constructor(public readonly expect: T, private readonly reporter: Reporter) {}

  get to() {
    return new To(this.expect, this.reporter, true)
  }
}
