import { describe } from 'noba'

describe('expect > toBeFalsy', ({ test }) => {
  test('should be falsy', ({ expect }) => {
    // String
    expect('').toBeFalsy()
    expect('').to.be.falsy()
    // Number
    expect(0).toBeFalsy()
    expect(0).to.be.falsy()
    // BigInt
    expect(0n).toBeFalsy()
    expect(0n).to.be.falsy()
    // Null
    expect(null).toBeFalsy()
    expect(null).to.be.falsy()
    // NaN
    expect(NaN).toBeFalsy()
    expect(NaN).to.be.falsy()
    // Undefined
    expect(undefined).toBeFalsy()
    expect(undefined).to.be.falsy()
  })

  test('should not be falsy', ({ expect }) => {
    // String
    expect('1').not.to.be.falsy()
    // Number
    expect(1).not.to.be.falsy()
    // Array
    expect([]).not.to.be.falsy()
    // Object
    expect({}).not.to.be.falsy()
  })
})
