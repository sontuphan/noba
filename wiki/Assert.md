`assert` is passed to every `test` callback. Each assertion returns `true` when it passes and throws when it fails.

Every assertion takes an optional last argument to replace the default failure message:

```ts
assert.equal(1 + 1, 2, 'math is broken')
```

# equal, notEqual

To loosely compare values (i.e. `==`). In the case of objects, it actually compares their references (pointers). If you wish to deep compare objects, let's use [deepEqual](#deepequal-notdeepequal).

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

To strictly compare values (i.e. `===`). There is no `notStrictEqual`; use `assert.isNotOk(a === b)` or `expect(a).not.to.be(b)`.

```ts
describe('strictEqual', ({ test }) => {
  test('should strictly compare 2 equal values', ({ assert }) => {
    assert.strictEqual('abc', 'abc') // Ok
    assert.strictEqual(0, false) // Failed

    const a = { x: 1 }
    const b = { x: 1 }
    assert.strictEqual(a, b) // Failed
  })
})
```

# deepEqual, notDeepEqual

Checks if two values are deeply equal. For objects and arrays, this means their own enumerable keys are recursively compared with `===` at the leaves. Prototypes are not compared, so `[]` and `{}` are deeply equal.

```ts
describe('deepEqual', ({ test }) => {
  test('should deeply compare 2 equal objects', ({ assert }) => {
    const a = { a: 1, b: { c: 2 } }
    const b = { a: 1, b: { c: 2 } }
    assert.deepEqual(a, b)
  })
})
```

```ts
describe('notDeepEqual', ({ test }) => {
  test('should differ 2 inequal objects', ({ assert }) => {
    assert.notDeepEqual({ a: 1 }, { a: 2 })
  })
})
```

# isUndefined, isNotUndefined

Checks if a value is `undefined`.

```ts
describe('isUndefined', ({ test }) => {
  test('should be undefined', ({ assert }) => {
    assert.isUndefined(undefined) // Ok
    assert.isUndefined(null) // Failed
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

# isNaN, isNotNaN

Checks if a value is `NaN` (using `Number.isNaN`, so `'abc'` is not `NaN`).

```ts
describe('isNaN', ({ test }) => {
  test('should be NaN', ({ assert }) => {
    assert.isNaN(NaN) // Ok
    assert.isNaN('abc') // Failed
  })
})
```

```ts
describe('isNotNaN', ({ test }) => {
  test('should not be NaN', ({ assert }) => {
    assert.isNotNaN(1)
    assert.isNotNaN(undefined)
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

# isTrue, isNotTrue

Checks if a value is true.

```ts
describe('isTrue', ({ test }) => {
  test('should be true', ({ assert }) => {
    assert.isTrue(true)
  })
})
```

```ts
describe('isNotTrue', ({ test }) => {
  test('should not be true', ({ assert }) => {
    assert.isNotTrue(false)
    assert.isNotTrue(0)
    assert.isNotTrue('')
  })
})
```

# isFalse, isNotFalse

Checks if a value is false.

```ts
describe('isFalse', ({ test }) => {
  test('should be false', ({ assert }) => {
    assert.isFalse(false)
  })
})
```

```ts
describe('isNotFalse', ({ test }) => {
  test('should not be false', ({ assert }) => {
    assert.isNotFalse(true)
    assert.isNotFalse(0)
    assert.isNotFalse('')
  })
})
```

# isExist, isNotExist

Checks if a value is neither `null` nor `undefined`.

```ts
describe('isExist', ({ test }) => {
  test('should exist', ({ assert }) => {
    assert.isExist(true)
    assert.isExist(false)
    assert.isExist(0)
    assert.isExist('')
  })
})
```

```ts
describe('isNotExist', ({ test }) => {
  test('should not exist', ({ assert }) => {
    assert.isNotExist(null)
    assert.isNotExist(undefined)
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

# throws, doesNotThrow

Checks whether a function throws an error whose `message` matches. A string matches if the message contains it; a regular expression matches if it tests true. The matcher is required.

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

`doesNotThrow` passes when the function does not throw, and also when it throws an error that does not match.

```ts
describe('doesNotThrow', ({ test }) => {
  test('should not throw', ({ assert }) => {
    assert.doesNotThrow(() => {}, 'abc')
  })
})
```

# rejects, doesNotReject

Checks whether an asynchronous function returns a rejected promise whose error `message` matches. Matching works the same as [throws](#throws-doesnotthrow). Remember to `await` it, otherwise a failure is not reported against the test.

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

`doesNotReject` passes when the promise resolves, and also when it rejects with an error that does not match.

```ts
describe('doesNotReject', ({ test }) => {
  test('should not reject', async ({ assert }) => {
    await assert.doesNotReject(async () => {}, 'abc')
  })
})
```

# fail

Fails the test unconditionally, with an optional message (default: `assertion failed`).

```ts
describe('fail', ({ test }) => {
  test('should not reach here', ({ assert }) => {
    assert.fail('unreachable')
  })
})
```
