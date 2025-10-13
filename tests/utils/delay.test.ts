import { delay, describe } from 'noba'

describe('utils > delay', ({ test }) => {
  test('should delay 500ms', async ({ expect }) => {
    const start = Date.now()
    await delay(500)
    const end = Date.now()
    expect(Math.round((end - start) / 100)).toEqual(5)
  })

  test('should delay 1s', async ({ expect }) => {
    const start = Date.now()
    await delay(1000)
    const end = Date.now()
    expect(Math.round((end - start) / 1000)).toEqual(1)
  })
})
