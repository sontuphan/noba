import { describe } from 'noba'

describe('assert > throws', ({ test }) => {
  test('should throw an error identical to a string', ({ assert }) => {
    assert.throws(() => {
      throw new Error('abc')
    }, 'abc')
  })

  test('should throw an error containing a string', ({ assert }) => {
    assert.throws(() => {
      throw new Error('abc')
    }, 'ab')
  })

  test('should throw an error matching a regex', ({ assert }) => {
    assert.throws(() => {
      throw new Error('abc')
    }, /ab/)
  })
})
