import { delay, describe } from 'noba'

describe('noba > each', ({ describe, beforeEach, afterEach }) => {
  beforeEach(async () => {
    await delay(500)
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

  afterEach(async () => {
    await delay(500)
  })
})
