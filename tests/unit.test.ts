import { describe, delay } from 'tare'

describe('unit test', async ({
  describe,
  test,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
}) => {
  beforeAll(async ({ log }) => {
    await delay(1000)
    log('before all')
  })
  afterAll(async ({ log }) => {
    log('after all')
  })

  beforeEach(async ({ log }) => {
    log('before each')
  })
  afterEach(async ({ log }) => {
    await delay(1000)
    log('after each')
  })

  test('should successfully return true #1', async ({ log, expect }) => {
    log('test #1')
    await delay(100)
    expect(1).toBe(1)
  })

  test('should successfully return true #2', async ({ log, expect }) => {
    log('test #2')
    await delay(300)
    const a = { a: 1 }
    const b = a
    expect(a).toBe(b)
  })

  test('should successfully return true #3', async ({ log, expect }) => {
    log('test #3')
    await delay(1000)
    expect(false).toBe(false)
  })

  describe('nested unit test', ({ test }) => {
    test('should successfully return false', async ({ expect }) => {
      expect('a').toBe('b')
    })
  })
})

describe('type test', ({ describe }) => {
  describe('nested type test', async ({ test }) => {
    test('should catch this exception', async () => {
      setTimeout(() => {
        throw new Error('an uncaught error')
      }, 1000)
    })

    test('should keep counting', async ({ expect, log }) => {
      for (let i = 0; i < 10; i++) {
        await delay(1000)
        log(i)
      }
      expect({ a: 1 }).toBe({ a: 1 })
    })

    test('should throw after the timeout', async ({ expect }) => {
      await delay(10000)
      expect({ a: 1 }).toBe({ a: 1 })
    })
  })
})
