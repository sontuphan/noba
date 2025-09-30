import Reporter from '../reporter'
import Be from './be'

export default class To<A> {
  constructor(
    public readonly actual: A,
    private readonly reporter: Reporter,
    private readonly negated = false,
  ) {}

  get infinitive() {
    return this.negated ? 'not to' : 'to'
  }

  get be() {
    return Be.new(this.actual, this.reporter, this.negated)
  }

  private expect = <E>(expected: E) => {
    this.reporter.green('- Expected:', expected)
    this.reporter.red('- Received:', this.actual)

    return `Expect ${this.actual} ${this.infinitive} ${expected}.`
  }

  private xor = (value: boolean) => {
    return value !== this.negated
  }

  private _equal = (a: any, b: any) => {
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
      if (!keysB.includes(key) || !this._equal(a[key], b[key])) return false

    return true
  }

  equal = <E extends A>(expected: E) => {
    if (this.xor(this._equal(this.actual, expected))) return true
    throw new Error(this.expect(`equal to ${expected}`))
  }

  private _contain = <T>(received: T) => {
    if (typeof this.actual === 'string' && typeof received === 'string')
      return this.actual.includes(received)
    if (Array.isArray(this.actual)) return this.actual.includes(received)
    return false
  }

  contain = <T>(received: T) => {
    if (this.xor(this._contain(received))) return true
    throw new Error(this.expect(`contain ${received}`))
  }

  private _containEqual = <T>(received: T) => {
    if (this._contain(received)) return true
    if (!Array.isArray(this.actual)) return false
    const index = this.actual.findIndex((a) => this._equal(a, received))
    return index >= 0
  }

  containEqual = <T>(received: T) => {
    if (this.xor(this._containEqual(received))) return true
    throw new Error(this.expect(`contain ${received}`))
  }

  private _haveLength = (received: number) => {
    if (Array.isArray(this.actual)) return this.actual.length === received
    if (typeof this.actual === 'string') return this.actual.length === received
    return false
  }

  haveLength = (received: number) => {
    if (this.xor(this._haveLength(received))) return true
    throw new Error(this.expect(`have the length of ${received}`))
  }
}
