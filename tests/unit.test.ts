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

  test('should successfully return true #1', async ({ log }) => {
    log('test #1.1')
  })
  test('should successfully return true #2', async ({ log }) => {
    log('test #2.1')
  })

  describe('nested unit test', ({ test }) => {
    test('should successfully return true #3', async ({ log }) => {
      log('test #3.1')
      log('test #3.2')
    })
  })
})

describe('type test', ({ describe }) => {
  describe('nested type test', async ({ test }) => {
    test('should sucessfully return true', ({ log }) => {
      log('test #2')
    })
  })
})
