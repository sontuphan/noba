import { describe } from 'noba'

describe('expect > toBeDefined', ({ test }) => {
  test('should be defined', ({ expect }) => {
    // String
    expect('').toBeDefined()
    expect('').to.be.defined()
    // Number
    expect(0).toBeDefined()
    expect(0).to.be.defined()
    // Null
    expect(null).toBeDefined()
    expect(null).to.be.defined()
  })

  test('should not be defined', ({ expect }) => {
    expect(undefined).not.to.be.defined()
  })
})
