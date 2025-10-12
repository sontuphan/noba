import { describe } from 'noba'

describe('assert > exist', ({ test }) => {
  test('should be exist', ({ assert }) => {
    assert.isExist(true)
    assert.isExist(false)
    assert.isExist(0)
    assert.isExist('')

    assert.throws(() => {
      assert.isExist(null)
    }, /not to be null and undefined/)

    assert.throws(() => {
      assert.isExist(undefined)
    }, /not to be null and undefined/)
  })

  test('should not be exist', ({ assert }) => {
    assert.isNotExist(null)
    assert.isNotExist(undefined)

    assert.throws(() => {
      assert.isNotExist(true)
    }, /to be null or undefined/)

    assert.throws(() => {
      assert.isNotExist(false)
    }, /to be null or undefined/)

    assert.throws(() => {
      assert.isNotExist(0)
    }, /to be null or undefined/)

    assert.throws(() => {
      assert.isNotExist('')
    }, /to be null or undefined/)
  })
})
