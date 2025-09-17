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
    expect(1).toBe(1)
  })
  test('should successfully return true #2', async ({ log, expect }) => {
    log('test #2')
    expect(false).toBe(false)
  })

  describe('nested unit test', ({ test }) => {
    test('should successfully return true #3', async ({ expect }) => {
      expect('a').toBe('b')
    })
  })
})

describe('type test', ({ describe }) => {
  describe('nested type test', async ({ test }) => {
    test('should sucessfully return true', ({ expect }) => {
      expect({ a: 1 }).toBe({ a: 1 })
    })
  })
})
