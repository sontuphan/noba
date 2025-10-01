import { describe } from 'noba'
import { spy } from 'noba/spy'

describe('noba > spy', ({ test }) => {
  const spiedCallback = spy((e: string, i: number) => ({ [e]: i }))

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
