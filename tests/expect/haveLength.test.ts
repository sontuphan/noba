import { describe } from 'noba'

describe('expect > toHaveLength', ({ test }) => {
  test('should have the correct length', ({ expect }) => {
    expect([1, 2, 3]).toHaveLength(3)
    expect('0123456789').to.haveLength(10)
  })

  test('should not have the correct length', ({ expect }) => {
    expect('0123456789').not.to.haveLength(9)
  })
})
