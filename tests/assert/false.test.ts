import { describe } from 'noba'

describe('assert > false', ({ test }) => {
  test('should be false', ({ assert }) => {
    assert.isFalse(false)
  })

  test('should not be false', ({ assert }) => {
    assert.isNotFalse(true)
    assert.isNotFalse(0)
    assert.isNotFalse('')
  })
})
