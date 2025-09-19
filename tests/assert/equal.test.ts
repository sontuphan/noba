import { describe } from 'noba'

describe('assert > equal', ({ test }) => {
  test('should compare 2 equal strings', ({ assert }) => {
    assert.equal('abc', 'abc')
  })

  test('should differ 2 inequal strings', ({ assert }) => {
    assert.notEqual('abc', '123')
  })

  test('should deeply compare 2 equal object', ({ assert }) => {
    const a = { a: 1, b: { c: 2 } }
    const b = { a: 1, b: { c: 2 } }
    assert.notEqual(a, b)
    assert.deepEqual(a, b)
  })

  test('should strictly compare 2 equal object', ({ assert }) => {
    const a = { a: 1, b: { c: 2 } }
    const b = a
    assert.strictEqual(a, b)
  })
})
