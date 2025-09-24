import { describe } from 'noba'

describe('expect > toContain', ({ test }) => {
  test('should contain the number', ({ expect }) => {
    expect([1, 2, 3]).toContain(1)
    expect([1, 2, 3]).to.contain(1)
  })

  test('should not contain the number', ({ expect }) => {
    expect([2, 3]).not.to.contain(1)
  })

  test('should not contain the object', ({ expect }) => {
    expect([{ a: 1 }, { b: 2 }, { c: 3 }]).not.to.contain({ a: 1 })
  })
})
