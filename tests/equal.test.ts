import { describe } from 'tare'

describe('expect.to.equal', ({ test }) => {
  test('should successfully compare 2 numbers', ({ expect }) => {
    expect(1).to.equal(1)
    expect(1).toEqual(2)
  })
})

describe('expect.not.to.equal', ({ test }) => {
  test('should successfully differ 2 numbers', ({ expect }) => {
    expect(1).not.to.equal(2)
    expect(1).not.to.equal(1)
  })
})
