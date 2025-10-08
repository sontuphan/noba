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

# toBeTruthy

Checks if a value is truthy.

```ts
describe('toBeTruthy', ({ test }) => {
  test('should be truthy', ({ expect }) => {
    expect(true).toBeTruthy() // Ok
    expect(1).toBeTruthy() // Ok
    expect('non-empty').toBeTruthy() // Ok
    expect([]).toBeTruthy() // Ok
    expect({}).toBeTruthy() // Ok
  })
})
```

# toBeFalsy

Checks if a value is falsy.

```ts
describe('toBeFalsy', ({ test }) => {
  test('should be falsy', ({ expect }) => {
    expect(false).toBeFalsy() // Ok
    expect(0).toBeFalsy() // Ok
    expect('').toBeFalsy() // Ok
    expect(null).toBeFalsy() // Ok
    expect(undefined).toBeFalsy() // Ok
  })
})
```

# toBeNull

Checks if a value is exactly `null`.

```ts
describe('toBeNull', ({ test }) => {
  test('should be null', ({ expect }) => {
    expect(null).toBeNull()
    expect(null).to.be.null()
  })
})
```

# toBeNaN

Checks if a value is exactly `NaN`.

```ts
describe('toBeNaN', ({ test }) => {
  test('should be NaN', ({ expect }) => {
    expect(NaN).toBeNaN()
    expect(NaN).to.be.nan()
  })
})
```

# toBeUndefined

Checks if a value is exactly `undefined`.

```ts
describe('toBeUndefined', ({ test }) => {
  test('should be undefined', ({ expect }) => {
    expect(undefined).toBeUndefined() // Ok
    expect(null).toBeUndefined() // Failed
  })
})
```

# toBeDefined

Checks if a value is not `undefined`.

```ts
describe('toBeDefined', ({ test }) => {
  test('should be defined', ({ expect }) => {
    expect(1).toBeDefined() // Ok
    expect(null).toBeDefined() // Ok
    expect(undefined).toBeDefined() // Failed
  })
})
```

# toContain

Checks if an array or string contains a value.

```ts
describe('toContain', ({ test }) => {
  test('should contain value in array', ({ expect }) => {
    expect([1, 2, 3]).toContain(2) // Ok
    expect(['a', 'b']).to.contain('b') // Ok
  })

  test('should contain substring', ({ expect }) => {
    expect('hello world').toContain('world') // Ok
  })
})
```

# toContainEqual

Checks if an array or string contains a value.

```ts
describe('toContainEqual', ({ test }) => {
  test('should contain object in array', ({ expect }) => {
    expect([{ a: 1 }, { b: 2 }]).toContainEqual({ b: 2 })
  })
})
```

# toBeOneOf

Checks if a value is strictly equal to one of the provided values.

```ts
describe('toBeOneOf', ({ test }) => {
  test('should be one of the values', ({ expect }) => {
    expect(2).toBeOneOf([1, 2, 3])
    expect('b').to.be.oneOf(['a', 'b', 'c'])
  })
})
```

# toBeTypeOf

Checks if a value is of a specific type.

```ts
describe('toBeTypeOf', ({ test }) => {
  test('should check type of value', ({ expect }) => {
    expect(1).toBeTypeOf('number') // Ok
    expect('hello').toBeTypeOf('string') // Ok
    expect(true).toBeTypeOf('boolean') // Ok
    expect({}).toBeTypeOf('object') // Ok
    expect([]).toBeTypeOf('object') // Ok (arrays are objects in JS)
    expect(undefined).toBeTypeOf('undefined') // Ok
    expect(() => {}).toBeTypeOf('function') // Ok
  })
})
```

# toBeInstanceOf

Checks if a value is an instance of a given constructor.

```ts
describe('toBeInstanceOf', ({ test }) => {
  test('should check instance of array', ({ expect }) => {
    expect([]).toBeInstanceOf(Array)
  })

  test('should check instance of object', ({ expect }) => {
    expect({}).toBeInstanceOf(Object)
  })

  test('should check instance of class', ({ expect }) => {
    class Foo {}
    const foo = new Foo()

    expect(foo).toBeInstanceOf(Foo)
  })
})
```

# throws

Checks if a function throws an error.

```ts
describe('throws', ({ test }) => {
  test('should throw error', ({ expect }) => {
    expect(() => {
      throw new Error('failed function')
    }).throws('failed') // Ok

    expect(() => {
      throw new Error('failed function')
    }).throws('failed function') // Ok

    expect(() => {
      throw new Error('failed function')
    }).throws(/failed/) // Ok
  })
})
```

# rejects

Checks if an async function rejects.

```ts
describe('rejects', ({ test }) => {
  test('should reject', async ({ expect }) => {
    await expect(async () => {
      throw new Error('failed function')
    }).rejects('failed') // Ok
  })
})
```

# toHaveLength

Checks if an object, array, or string has the expected length.

```ts
describe('toHaveLength', ({ test }) => {
  test('should check length of array', ({ expect }) => {
    expect([1, 2, 3]).toHaveLength(3)
  })

  test('should check length of string', ({ expect }) => {
    expect('hello').toHaveLength(5)
  })

  test('should check length of object with length property', ({ expect }) => {
    expect({ length: 2 }).toHaveLength(2)
  })
})
```

# toHaveBeenCalled

Checks if a spied function whether being called or not.

[Learn more about Spy.](/sontuphan/noba/wiki/spy)

```ts
describe('toHaveBeenCalled', ({ test }) => {
  test('should be called on a spied function', ({ expect }) => {
    const fn = spy(() => {})

    fn()

    expect(fn).toHaveBeenCalled()
  })
})
```

# toHaveBeenCalledWith

Checks if a spied function being called with specific inputs.

[Learn more about Spy.](/sontuphan/noba/wiki/spy)

```ts
describe('toHaveBeenCalledWith', ({ test }) => {
  test('should be called with a predefined params on a spied sync function', ({
    expect,
  }) => {
    const fn = spy((..._args: any[]) => {})

    const params = [1, 'a', { b: 2 }]
    fn(...params)

    expect(fn).toHaveBeenCalledWith(...params)
  })
})
```
