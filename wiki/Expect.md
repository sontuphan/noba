# toBe

To strictly compare values. In the case of objects, it actually compares their references (pointers). If you wish to deep compare objects, let's use [toEqual](#toEqual).

```ts
describe('toBe', ({ test }) => {
  test('should be same values', ({ expect }) => {
    expect(1).toBe(1) // Ok
    expect(1n).toBe(1n) // Ok
    expect('string').to.be('string') //
  })

  test('should be same objects', ({ expect }) => {
    const a = { a: 1 }
    const b = a
    const c = { a: 1 }

    expect(a).toBe(b) // Ok
    expect(a).to.be(c) // Failed
  })
})
```

# toEqual

To compare equality of 2 values.

```ts
describe('toEqual', ({ test }) => {
  test('should compare 2 equal values', ({ expect }) => {
    expect(1).toEqual(1) // Ok
    expect(1n).toEqual(1n) // Ok
    expect('').to.equal('') // Ok
  })

  test('should compare 2 equal objects', ({ expect }) => {
    const a = { a: 1 }
    const b = { a: 1 }

    expect(a).toEqual(b) // Ok
  })
})
```
