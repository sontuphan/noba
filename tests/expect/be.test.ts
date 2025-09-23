import { describe } from 'noba'

describe('expect > toBe', ({ test }) => {
  test('should be same objects', ({ expect }) => {
    const a = { a: 1 }
    const b = a

    expect(a).toBe(b)
    expect(a).to.be.be(b)
  })

  test('should not be same objects', ({ expect }) => {
    const a = { a: 1 }
    const a_ = { a: 1 }
    const b = { b: 2 }

    expect<Record<string, number>>(a).not.to.be.be(a_)
    expect<Record<string, number>>(a).not.to.be.be(b)
  })
})
