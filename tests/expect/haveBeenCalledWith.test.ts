import { describe } from 'noba'
import { spy } from 'noba/spy'

describe('expect > toHaveBeenCalledWith', ({ test }) => {
  test('should be called with a predefined params on a spied sync function', ({
    expect,
  }) => {
    const fn = spy((..._args: any[]) => {})

    const params = [1, 'a', { b: 2 }]
    fn(...params)

    expect(fn).toHaveBeenCalledWith(...params)
  })

  test('should be called with a predefined params on a spied async function', async ({
    expect,
  }) => {
    const fn = spy(async (..._args: any[]) => {})

    const params = [1, 'a', { b: 2 }]
    await fn(...params)

    expect(fn).toHaveBeenCalledWith(...params)
  })
})
