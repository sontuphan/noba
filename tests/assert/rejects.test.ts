import { delay, describe } from 'noba'

describe('assert > rejects', ({ test }) => {
  test('should reject an error identical to a string', async ({ assert }) => {
    await assert.rejects(async () => {
      await delay(100)
      throw new Error('abc')
    }, 'abc')
  })

  test('should reject an error containing a string', async ({ assert }) => {
    await assert.rejects(async () => {
      await delay(100)
      throw new Error('abc')
    }, 'ab')
  })

  test('should reject an error matching a regex', async ({ assert }) => {
    await assert.rejects(async () => {
      await delay(100)
      throw new Error('abc')
    }, /ab/)
  })
})
