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

  test('should not throw any error', ({ assert }) => {
    const expected = /there is no error/

    assert.doesNotThrow(() => {}, expected)

    assert.throws(() => {
      assert.throws(() => {}, expected)
    }, /the function to throw an error with message sastifying \/there is no error\//)
  })

  test('should not throw an error with expected message', ({ assert }) => {
    const error = 'there is an error'
    const expected = /there is no error/

    assert.doesNotThrow(() => {
      throw new Error(error)
    }, expected)

    assert.throws(() => {
      assert.throws(() => {
        throw new Error(error)
      }, expected)
    }, /the function to throw an error with message sastifying \/there is no error\//)
  })
})
