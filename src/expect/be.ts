import Reporter from '../reporter'

export default class Be<A> {
  constructor(
    public readonly actual: A,
    private readonly reporter: Reporter,
    private readonly negated = false,
  ) {}

  get infinitive() {
    return this.negated ? 'not to be' : 'to be'
  }

  private expect = <E>(expected: E) => {
    this.reporter.green('- Expected:', expected)
    this.reporter.red('- Received:', this.actual)

    return `Expect ${this.actual} ${this.infinitive} ${expected}.`
  }

  private xor = (value: boolean) => {
    return value !== this.negated
  }

  private _be = <E extends A>(expected: E) => {
    return this.actual === expected
  }

  be = <E extends A>(expected: E) => {
    if (this.xor(this._be(expected))) return true
    throw new Error(this.expect(expected))
  }

  private _defined = () => {
    return this.actual !== undefined
  }

  defined = () => {
    if (this.xor(this._defined())) return true
    throw new Error(this.expect('defined'))
  }

  private _undefined = () => {
    return this.actual === undefined
  }

  undefined = () => {
    if (this.xor(this._undefined())) return true
    throw new Error(this.expect('undefined'))
  }

  private _truthy = () => {
    return !!this.actual
  }

  truthy = () => {
    if (this.xor(this._truthy())) return true
    throw new Error(this.expect('truthy'))
  }

  private _falsy = () => {
    return !this.actual
  }

  falsy = () => {
    if (this.xor(this._falsy())) return true
    throw new Error(this.expect('falsy'))
  }

  private _null = () => {
    return this.actual === null
  }

  null = () => {
    if (this.xor(this._null())) return true
    throw new Error(this.expect(null))
  }

  private _nan = () => {
    return Number.isNaN(this.actual)
  }

  nan = () => {
    if (this.xor(this._nan())) return true
    throw new Error(this.expect(NaN))
  }

  private _oneOf = (array: Array<A>) => {
    return array.includes(this.actual)
  }

  oneOf = (array: Array<A>) => {
    if (this.xor(this._oneOf(array))) return true
    throw new Error(this.expect(`one of ${array}`))
  }

  private _typeOf = (type: string) => {
    return typeof this.actual === type
  }

  typeOf = (type: string) => {
    if (this.xor(this._typeOf(type))) return true
    throw new Error(this.expect(`type of ${type}`))
  }

  private _instanceOf = <T>(constructor: new (...args: any[]) => T) => {
    return this.actual instanceof constructor
  }

  instanceOf = <T>(constructor: new (...args: any[]) => T) => {
    if (this.xor(this._instanceOf(constructor))) return true
    throw new Error(this.expect(`instance of ${constructor}`))
  }
}
