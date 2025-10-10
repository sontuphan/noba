import { describe } from 'noba'

describe('expect > toBeNull', ({ test }) => {
  test('should be null', ({ expect }) => {
    expect(null).toBeDefined()
    expect(null).to.be.null()
  })

  test('should not be null', ({ expect }) => {
    expect(undefined).not.to.be.null()
    expect(NaN).not.to.be.null()
  })
})
