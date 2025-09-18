import Reporter from '../reporter'

export default class Be<T> {
  constructor(
    public readonly expect: T,
    private readonly reporter: Reporter,
    private readonly not = false,
  ) {}

  get infinitive() {
    return this.not ? 'not to be' : 'to be'
  }

  private compare = (value: boolean) => {
    return value === !this.not
  }
}
