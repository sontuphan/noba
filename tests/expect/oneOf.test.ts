import { describe } from 'noba'

describe('expect > toBeOneOf', ({ test }) => {
  test('should be one of the array', ({ expect }) => {
    expect(1).toBeOneOf([1, 2, 3])
    expect(1).to.be.oneOf([1, 2, 3])
  })

  test('should not be one of the array', ({ expect }) => {
    // Number
    expect(1).not.to.be.oneOf([2, 3])
    // Object
    expect<Record<string, number>>({ a: 1 }).not.to.be.oneOf([
      { a: 1 },
      { b: 2 },
      { c: 3 },
    ])
  })
})
