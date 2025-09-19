import { describe } from 'tare'

describe('expect.to.equal', ({ test }) => {
  test('should compare 2 numbers', ({ expect }) => {
    expect(1).to.equal(1)
  })
})

describe('expect.not.to.equal', ({ test }) => {
  test('should differ 2 numbers', ({ expect }) => {
    expect(1).not.to.equal(2)
  })
})

describe('assert.equal', ({ test }) => {
  test('should compare 2 strings', ({ assert }) => {
    assert.equal('abc', 'abc')
  })
})
