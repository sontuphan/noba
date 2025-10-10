import { describe } from 'noba'

describe('assert > exist', ({ test }) => {
  test('should be exist', ({ assert }) => {
    assert.isExist(true)
    assert.isExist(false)
    assert.isExist(0)
    assert.isExist('')
  })

  test('should not be true', ({ assert }) => {
    assert.isNotExist(null)
    assert.isNotExist(undefined)
  })
})
