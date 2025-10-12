import { describe } from 'noba'

describe('assert > instance of', ({ test }) => {
  class Foo {}
  class Bar {}

  test('should be instance of Foo', ({ assert }) => {
    const foo: any = new Foo()

    assert.throws(() => {
      assert.notInstanceOf(foo, Foo)
    }, /not to be an instance of/)

    if (assert.instanceOf(foo, Foo)) foo
  })

  test('should be not instance of Foo', ({ assert }) => {
    const bar = new Bar()

    assert.throws(() => {
      assert.instanceOf(bar, Foo)
    }, /to be an instance of/)

    assert.notInstanceOf(bar, Foo)
  })
})
