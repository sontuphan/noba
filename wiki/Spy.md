In testing (especially in unit testing), a spy is a special kind of test double (like a mock or stub) that records how a function is used during a test: how many times it was called, with what arguments, and what it returned.

Think of a spy as a "hidden observer" that wraps a real function or replaces it, so you can verify interactions without changing the function's behavior.

> 💡 This feature is using [tinyspy](https://github.com/tinylibs/tinyspy) under the hood. `noba/spy` re-exports its `spy` and `spyOn`.

# Basic Use

A spy keeps its records until you call `reset()`. Create one per test, or reset it in `beforeEach`, so that calls from one test do not leak into the next.

```ts
import { describe } from 'noba'
import { spy } from 'noba/spy'

describe('spy', ({ test }) => {
  test('should spy with expect', ({ expect }) => {
    const spiedCallback = spy((e: string, i: number) => ({ [e]: i }))
    const data = ['a', 'b']

    data.forEach(spiedCallback)

    // The spy was called
    expect(spiedCallback).to.haveBeenCalled()

    // One call received ('a', 0, data)
    expect(spiedCallback).to.haveBeenCalledWith(data[0], 0, data)

    // One call received ('b', 1, data)
    expect(spiedCallback).toHaveBeenCalledWith(data[1], 1, data)
  })

  test('should spy with assert', ({ assert }) => {
    const spiedCallback = spy((e: string, i: number) => ({ [e]: i }))
    const data = ['a', 'b']

    data.forEach(spiedCallback)

    // The spy was called twice
    assert.strictEqual(spiedCallback.callCount, 2)

    // The arguments of the first call
    assert.deepEqual(spiedCallback.calls[0], [data[0], 0, data])

    // The arguments of the second call
    assert.deepEqual(spiedCallback.calls[1], [data[1], 1, data])

    // The result of the first call, as a [status, value] tuple
    assert.deepEqual(spiedCallback.results[0], ['ok', { a: 0 }])

    // The return values of all calls
    assert.deepEqual(spiedCallback.returns, [{ a: 0 }, { b: 1 }])
  })
})
```

## Spy state

| Property / method | Description                                                             |
| ----------------- | ----------------------------------------------------------------------- |
| `called`          | `true` once the spy has been called.                                    |
| `callCount`       | Number of calls.                                                        |
| `calls`           | Arguments of each call, e.g. `[['a', 0, data], ['b', 1, data]]`.        |
| `results`         | `['ok', value]` or `['error', error]` for each call.                    |
| `returns`         | Return values of the calls that did not throw.                          |
| `reset()`         | Clears the recorded calls and results.                                  |
| `restore()`       | `spyOn` only: puts the original method back on the object.              |

# spyOn

`spyOn(object, method, impl?)` replaces `object[method]` with a spy. With `impl`, the spy calls `impl` instead of the original; without it, the original still runs and is observed.

The replacement is global: every module that uses the same object sees the spy until you call `restore()`.

```ts
import child from 'child_process'
import { describe } from 'noba'
import { spyOn } from 'noba/spy'

describe('spyOn', ({ test, afterAll }) => {
  const spiedLib = spyOn(child, 'spawnSync', (): any => {
    return {
      status: 0,
    }
  })

  afterAll(() => spiedLib.restore())

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

To replace a function that another module imports, rather than a method on a shared object, use a [mock](/sontuphan/noba/wiki/mock).
