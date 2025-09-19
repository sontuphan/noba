import { test } from 'tare'

test('should be instance of Error', ({ assert }) => {
  const er = new Error()
  assert.notInstanceOf(er, Error)
  er
})
