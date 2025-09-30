import { delay, describe } from 'noba'

describe('noba > all', ({ describe, beforeAll, afterAll }) => {
  beforeAll(async () => {
    await delay(1000)
  })

  describe('should be the first middle describe', ({ test }) => {
    test('should be the first middle test', ({ assert }) => {
      assert.isTrue(true)
    })
  })

  describe('should be the second middle describe', ({ test }) => {
    test('should be the second middle test', ({ assert }) => {
      assert.isFalse(false)
    })
  })

  afterAll(async () => {
    await delay(1000)
  })
})
