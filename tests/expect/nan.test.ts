import { describe } from 'noba'

describe('expect > toBeNaN', ({ test }) => {
  test('should be NaN', ({ expect }) => {
    expect(NaN).toBeDefined()
    expect(NaN).to.be.nan()
  })

  test('should not be NaN', ({ expect }) => {
    expect(undefined).not.to.be.nan()
    expect(null).not.to.be.nan()
  })
})
