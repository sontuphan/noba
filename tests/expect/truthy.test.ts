import { describe } from 'noba'

describe('expect > toBeTruthy', ({ test }) => {
  test('should be truthy', ({ expect }) => {
    // String
    expect('1').toBeTruthy()
    expect('1').to.be.truthy()
    // Number
    expect(1).toBeTruthy()
    expect(1).to.be.truthy()
    // Array
    expect([]).toBeTruthy()
    expect([]).to.be.truthy()
    // Object
    expect({}).toBeTruthy()
    expect({}).to.be.truthy()
  })

  test('should not be truthy', ({ expect }) => {
    // String
    expect('').not.to.be.truthy()
    // Number
    expect(0).not.to.be.truthy()
    // BigInt
    expect(0n).not.to.be.truthy()
    // Null
    expect(null).not.to.be.truthy()
    // NaN
    expect(NaN).not.to.be.truthy()
    // Undefined
    expect(undefined).not.to.be.truthy()
  })
})
