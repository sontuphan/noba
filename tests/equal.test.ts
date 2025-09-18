import { describe } from 'tare'

describe('expect.to.equal', ({ test }) => {
  test('should successfully compare 2 numbers', ({ expect }) => {
    expect(1).to.equal(1)
    expect(1).toEqual(1)
  })
})

describe('expect.not.to.equal', ({ test }) => {
  test('should successfully differ 2 numbers', ({ expect }) => {
    expect(1).not.to.equal(2)
  })
})

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
