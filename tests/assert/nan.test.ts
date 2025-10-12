import { describe } from 'noba'

describe('assert > nan', ({ test }) => {
  test('should be nan', ({ assert }) => {
    assert.isNaN(NaN)

    assert.throws(() => {
      assert.isNotNaN(NaN)
    }, /not to be NaN/)
  })

  test('should not be nan', ({ assert }) => {
    assert.isNotNaN(undefined)

    assert.throws(() => {
      assert.isNaN(undefined)
    }, /to be NaN/)
  })
})
