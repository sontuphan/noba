import { describe } from 'noba'

describe('expect > toEqual', ({ test }) => {
  test('should compare 2 equal numbers', ({ expect }) => {
    expect(1).to.equal(1)
  })

  test('should compare 2 equal objects', ({ expect }) => {
    const a = { a: 1 }
    const b = { a: 1 }

    expect(a).to.equal(b)
  })

  test('should differ 2 inequal numbers', ({ expect }) => {
    expect(1).not.to.equal(2)
  })
})
