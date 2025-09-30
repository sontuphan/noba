import { describe } from 'noba'

describe('expect > toContainEqual', ({ test }) => {
  test('should contain the string', ({ expect }) => {
    expect('123').toContainEqual('1')
    expect('123').to.containEqual('1')
  })

  test('should contain the number', ({ expect }) => {
    expect([1, 2, 3]).toContainEqual(1)
    expect([1, 2, 3]).to.containEqual(1)
  })

  test('should contain the object', ({ expect }) => {
    expect([{ a: 1 }, { b: 2 }, { c: 3 }]).to.containEqual({ a: 1 })
  })

  test('should not contain the string', ({ expect }) => {
    expect('23').not.to.containEqual('1')
  })

  test('should not contain the number', ({ expect }) => {
    expect([2, 3]).not.to.containEqual(1)
  })

  test('should not contain the object', ({ expect }) => {
    expect([{ b: 2 }, { c: 3 }]).not.to.containEqual({ a: 1 })
  })
})
