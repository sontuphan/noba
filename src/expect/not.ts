import Reporter from 'src/reporter'
import To from './to'

export default class Not<A> {
  constructor(public readonly actual: A, private readonly reporter: Reporter) {}

  get to() {
    return new To(this.actual, this.reporter, true)
  }
}
