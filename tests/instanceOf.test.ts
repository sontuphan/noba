import { describe } from 'tare'

describe('instance of', ({ test }) => {
  class Foo {}
  class Bar {}

  test('should be instance of Foo', ({ assert }) => {
    const foo: any = new Foo()
    if (assert.instanceOf(foo, Foo)) foo
  })

  test('should be not instance of Foo', ({ assert }) => {
    const bar = new Bar()
    assert.notInstanceOf(bar, Foo)
  })
})
