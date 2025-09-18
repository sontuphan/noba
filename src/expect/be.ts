import Logger from '../info/logger'

export default class Be<T> {
  constructor(
    public readonly expect: T,
    private readonly logger: Logger = new Logger(),
    private readonly not = false,
  ) {}

  get infinitive() {
    return this.not ? 'not to be' : 'to be'
  }

  private compare = (value: boolean) => {
    return value === !this.not
  }
}
