# equal, notEqual

To loosely compare values (i.e. `==`). In the case of objects, it actually compares their references (pointers). If you wish to deep compare objects, let's use [deepEqual](#deepEqual).

```ts
describe('equal', ({ test }) => {
  test('should loosely compare 2 equal values', ({ assert }) => {
    assert.equal('abc', 'abc') // Ok
    assert.equal(0, false) // Ok

    const a = { x: 1 }
    const b = { x: 1 }
    assert.equal(a, b) // Failed
  })
})
```

```ts
describe('notEqual', ({ test }) => {
  test('should differ 2 inequal strings', ({ assert }) => {
    assert.notEqual('abc', '123')
  })

  test('should differ 2 inequal objects', ({ assert }) => {
    const a = { a: 1, b: { c: 2 } }
    const b = { a: 1, b: { c: 2 } }
    assert.notEqual(a, b)
  })
})
```

# strictEqual

To strictly compare values (i.e. `===`)

```ts
describe('strictEqual', ({ test }) => {
  test('should stricly compare 2 equal values', ({ assert }) => {
    assert.equal('abc', 'abc') // Ok
    assert.equal(0, false) // Failed

    const a = { x: 1 }
    const b = { x: 1 }
    assert.equal(a, b) // Failed
  })
})
```

# deepEqual

Checks if two values are deeply equal. For objects and arrays, this means their properties and contents are recursively compared.

```ts
describe('deepEqual', ({ test }) => {
  test('should deeply compare 2 equal objects', ({ assert }) => {
    const a = { a: 1, b: { c: 2 } }
    const b = { a: 1, b: { c: 2 } }
    assert.deepEqual(a, b)
  })
})
```

# isUndefined, isNotUndefined

Checks if a value is `undefined`.

```ts
describe('isUndefined', ({ test }) => {
  test('should not be undefined', ({ assert }) => {
    assert.isNotUndefined(null)
  })
})
```

```ts
describe('isNotUndefined', ({ test }) => {
  test('should not be undefined', ({ assert }) => {
    assert.isNotUndefined(null)
  })
})
```

# isNull, isNotNull

Checks if a value is `null`.

```ts
describe('isNull', ({ test }) => {
  test('should be null', ({ assert }) => {
    assert.isNull(null) // Ok
    assert.isNull(undefined) // Failed
  })
})
```

```ts
describe('isNotNull', ({ test }) => {
  test('should not be null', ({ assert }) => {
    assert.isNotNull(undefined)
  })
})
```

# isOk, isNotOk

Checks if value is truthy.

```ts
describe('isOk', ({ test }) => {
  test('should be a truthy value', ({ assert }) => {
    assert.isOk(1) // Ok
    assert.isOk('1') // Ok
    assert.isOk({ a: 1 }) // Ok
  })
})
```

```ts
describe('isNotOk', ({ test }) => {
  test('should not be a truthy value', ({ assert }) => {
    assert.isNotOk(0)
    assert.isNotOk('')
    assert.isNotOk(NaN)
    assert.isNotOk(null)
    assert.isNotOk(undefined)
  })
})
```

# instanceOf, notInstanceOf

Checks if a value is an instance of a specified constructor. For type narrowing, use an `if` statement with `assert.instanceOf`.

```ts
describe('instanceOf', ({ test }) => {
  class Foo {}

  test('should be instance of Foo', ({ assert }) => {
    const foo = new Foo()
    assert.instanceOf(foo, Foo) // Ok
  })

  test('should narrow the type', ({ assert }) => {
    const foo: any = new Foo()
    if (assert.instanceOf(foo, Foo)) foo // foo is Foo
  })
})
```

```ts
describe('notInstanceOf', ({ test }) => {
  class Foo {}
  class Bar {}

  test('should be not instance of Foo', ({ assert }) => {
    const bar = new Bar()
    assert.notInstanceOf(bar, Foo)
  })
})
```

# throws

Checks whether a function throws an error. You can match the thrown error by its message (exact string), a substring, or a regular expression.

```ts
describe('throws', ({ test }) => {
  test('should throw an error identical to a string', ({ assert }) => {
    assert.throws(() => {
      throw new Error('abc')
    }, 'abc')
  })

  test('should throw an error containing a string', ({ assert }) => {
    assert.throws(() => {
      throw new Error('abc')
    }, 'ab')
  })

  test('should throw an error matching a regex', ({ assert }) => {
    assert.throws(() => {
      throw new Error('abc')
    }, /ab/)
  })
})
```

# rejects

Checks whether an asynchronous function returns a rejected promise.

```ts
describe('rejects', ({ test }) => {
  test('should reject an error identical to a string', async ({ assert }) => {
    await assert.rejects(async () => {
      throw new Error('abc')
    }, 'abc')
  })

  test('should reject an error containing a string', async ({ assert }) => {
    await assert.rejects(async () => {
      throw new Error('abc')
    }, 'ab')
  })

  test('should reject an error matching a regex', async ({ assert }) => {
    await assert.rejects(async () => {
      throw new Error('abc')
    }, /ab/)
  })
})
```
