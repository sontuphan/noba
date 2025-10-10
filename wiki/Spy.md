In testing (especially in unit testing), a spy is a special kind of test double (like a mock or stub) that records information about how a function or object is used during a test — for example, how many times it was called, with what arguments, and what it returned.

Think of a spy as a “hidden observer” that wraps a real function or replaces it, so you can verify interactions without changing the function’s behavior.

> 💡 This feature is using [tinyspy](https://github.com/tinylibs/tinyspy) under the hood.

# Basic Use

```ts
import { describe } from 'noba'
import { spy } from 'noba/spy'

describe('spy', ({ test }) => {
  const spiedCallback = spy((e: string, i: number) => ({ [e]: i }))

  test('should spy on the forEach function', ({ expect }) => {
    const data = ['a', 'b']

    data.forEach(spiedCallback)

    // The mock function was called
    expect(spiedCallback).to.haveBeenCalled()

    // The first argument of the first call to the function was 0
    expect(spiedCallback).to.haveBeenCalledWith(data[0], 0, data)

    // The first argument of the second call to the function was 1
    assert(spiedCallback).toHaveBeenCalledWith(data[1], 1, data)
  })

  test('should spy on the forEach function', ({ assert }) => {
    const data = ['a', 'b']

    data.forEach(spiedCallback)

    // The mock function was called twice
    assert.strictEqual(spiedCallback.callCount, 2)

    // The first argument of the first call to the function was 0
    assert.deepEqual(spiedCallback.calls[0], [data[0], 0, data])

    // The first argument of the second call to the function was 1
    assert.deepEqual(spiedCallback.calls[1], [data[1], 1, data])

    // The return value of the first call to the function was 42
    assert.deepEqual(spiedCallback.results[0], ['ok', { a: 0 }])
  })
})
```

# spyOn

```ts
import child from 'child_process'
import { describe } from 'noba'
import { spyOn } from 'noba/spy'

describe('spyOn', ({ test }) => {
  const spiedLib = spyOn(child, 'spawnSync', (): any => {
    return {
      status: 0,
    }
  })

  test('spyOn on object', ({ assert }) => {
    child.spawnSync('echo', ['this function was spied'], {
      stdio: 'inherit',
      shell: true,
    })

    assert.isTrue(spiedLib.called)
    assert.deepEqual(spiedLib.returns, [{ status: 0 }])
  })
})
```
