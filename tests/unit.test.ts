import { describe } from 'tare'

describe('unit test', async ({ test }) => {
  test('should successfully return true #1', async ({ log }) => {
    log('test #1')
  })
})

describe('type test', ({ describe }) => {
  describe('nested type test', async ({ test }) => {
    test('should sucessfully return true', ({ log }) => {
      log('test #2')
    })
  })
})
