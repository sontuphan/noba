import { describe } from 'noba'

describe('noba > fail', async ({ test }) => {
  test('should be failed', ({ assert }) => {
    const msg = 'a failed assertion'
    assert.throws(() => {
      assert.fail(msg)
    }, msg)
  })
})
