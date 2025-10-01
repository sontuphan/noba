import { describe } from 'noba'

describe('expect > throws', ({ test }) => {
  test('should throw an error identical to a string', ({ expect }) => {
    expect(() => {
      throw new Error('abc')
    }).throws('abc')
  })

  test('should throw an error containing a string', ({ expect }) => {
    expect(() => {
      throw new Error('abc')
    }).throws('ab')
  })

  test('should throw an error matching a regex', ({ expect }) => {
    expect(() => {
      throw new Error('abc')
    }).throws(/ab/)
  })
})
