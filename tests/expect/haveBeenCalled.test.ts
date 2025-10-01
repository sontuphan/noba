import { describe } from 'noba'
import { spy } from 'noba/spy'

describe('expect > toHaveBeenCalled', ({ test }) => {
  test('should be called on a spied sync function', ({ expect }) => {
    const fn = spy(() => {})

    fn()

    expect(fn).toHaveBeenCalled()
  })

  test('should be called on a spied async function', async ({ expect }) => {
    const fn = spy(async () => {})

    await fn()

    expect(fn).toHaveBeenCalled()
  })
})
