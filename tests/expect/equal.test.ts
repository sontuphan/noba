import { describe } from 'noba'

describe('expect > equal', ({ test }) => {
  test('should compare 2 equal numbers', ({ expect }) => {
    expect(1).to.equal(1)
  })

  test('should differ 2 inequal numbers', ({ expect }) => {
    expect(1).not.to.equal(2)
  })
})
