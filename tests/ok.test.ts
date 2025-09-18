import { describe } from 'tare'

describe('assert.isOk', ({ test }) => {
  test('should be a truthy value', ({ assert }) => {
    assert.isOk(1)
    assert.isOk('1')
    assert.isOk({ a: 1 })
  })
})

describe('assert.isNotOk', ({ test }) => {
  test('should not be a truthy value', ({ assert }) => {
    assert.isNotOk(0)
    assert.isNotOk('')
    assert.isNotOk(NaN)
    assert.isNotOk(null)
    assert.isNotOk(undefined)
  })
})
