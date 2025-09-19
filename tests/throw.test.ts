import { delay, describe } from 'noba'

describe('noba.throw', ({ test }) => {
  test('should throw an exception', () => {
    setTimeout(() => {
      throw { an: 'exception' }
    }, 1000)
  })

  test('should wait and keep counting', async ({ assert, log }) => {
    for (let i = 0; i < 10; i++) {
      await delay(1000)
      log(i)
      assert.isOk(typeof i === 'number')
    }
  })
})
