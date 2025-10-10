import { describe } from 'noba'

describe('assert > (equal)', ({ test }) => {
  describe('equal', ({ test }) => {
    test('should compare 2 equal strings', ({ assert }) => {
      assert.equal('abc', 'abc')
    })

    test('should differ 2 inequal strings', ({ assert }) => {
      assert.notEqual('abc', '123')
    })

    test('should differ 2 inequal objects', ({ assert }) => {
      const a = { a: 1, b: { c: 2 } }
      const b = { a: 1, b: { c: 2 } }
      assert.notEqual(a, b)
    })
  })

  describe('strictEqual', ({ test }) => {
    test('should strictly compare 2 equal objects', ({ assert }) => {
      const a = { a: 1, b: { c: 2 } }
      const b = a
      assert.strictEqual(a, b)
    })
  })

  describe('deepEqual', ({ test }) => {
    test('should deeply compare 2 equal objects', ({ assert }) => {
      const a = { a: 1, b: { c: 2 } }
      const b = { a: 1, b: { c: 2 } }
      assert.deepEqual(a, b)
    })

    test('should deeply differ 2 inequal objects', ({ assert }) => {
      const a = { a: 1, b: { c: 2 } }
      const b = { a: 1, b: { d: 2 } }
      assert.notDeepEqual(a, b)
    })
  })
})
