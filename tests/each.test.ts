import { delay, describe } from 'noba'

describe('noba > each', ({ describe, beforeEach, afterEach }) => {
  beforeEach(async ({ log }) => {
    log('beforeEach')
    await delay(1000)
    throw new Error('before-each')
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

  afterEach(async ({ log }) => {
    log('afterEach')
    await delay(1000)
  })
})
