import { describe } from 'noba'

describe('assert.null', ({ test }) => {
  test('should be null', ({ assert }) => {
    assert.isNull(null)
  })

  test('should not be null', ({ assert }) => {
    assert.isNotNull(undefined)
  })
})
