import { describe } from 'noba'

describe('expect > toBeInstanceOf', ({ test }) => {
  class Foo {}
  class Bar {}

  test('should be instance of Foo', ({ expect }) => {
    const foo: any = new Foo()
    expect(foo).to.be.instanceOf(Foo)
  })

  test('should be not instance of Foo', ({ expect }) => {
    const bar = new Bar()
    expect(bar).not.to.be.instanceOf(Foo)
  })
})
