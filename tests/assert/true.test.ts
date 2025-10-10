import { describe } from 'noba'

describe('assert > true', ({ test }) => {
  test('should be true', ({ assert }) => {
    assert.isTrue(true)
  })

  test('should not be true', ({ assert }) => {
    assert.isNotTrue(false)
    assert.isNotTrue(0)
    assert.isNotTrue('')
  })
})
