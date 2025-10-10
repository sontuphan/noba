import { describe } from 'noba'

describe('expect > toBeUndefined', ({ test }) => {
  test('should be undefined', ({ expect }) => {
    expect(undefined).toBeUndefined()
    expect(undefined).to.be.undefined()
  })

  test('should not be undefined', ({ expect }) => {
    // String
    expect('').not.to.be.undefined()
    // Number
    expect(0).not.to.be.undefined()
    // Null
    expect(null).not.to.be.undefined()
  })
})
