import { describe } from 'noba'

describe('assert.undefined', ({ test }) => {
  test('should be undefined', ({ assert }) => {
    assert.isUndefined(undefined)
  })

  test('should not be undefined', ({ assert }) => {
    assert.isNotUndefined(null)
  })
})
