export default class Expect<T> {
  constructor(public readonly expect: T) {}

  toBe = (actual: T) => {
    if (this.expect !== actual)
      throw new Error(`Expect ${this.expect} - Actual ${actual}`)
  }
}
