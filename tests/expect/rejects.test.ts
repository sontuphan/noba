import { delay, describe } from 'noba'

describe('expect > rejects', ({ test }) => {
  test('should reject an error identical to a string', async ({ expect }) => {
    await expect(async () => {
      await delay(100)
      throw new Error('abc')
    }).rejects('abc')
  })

  test('should reject an error containing a string', async ({ expect }) => {
    await expect(async () => {
      await delay(100)
      throw new Error('abc')
    }).rejects('ab')
  })

  test('should reject an error matching a regex', async ({ expect }) => {
    await expect(async () => {
      await delay(100)
      throw new Error('abc')
    }).rejects(/ab/)
  })
})
