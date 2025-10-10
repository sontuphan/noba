import { describe } from 'noba'

describe('expect > toBeTypeOf', ({ test }) => {
  test('should be a type of number', ({ expect }) => {
    expect(1).toBeTypeOf('number')
  })

  test('should be a type of string', ({ expect }) => {
    expect('1').toBeTypeOf('string')
  })

  test('should be a type of bigint', ({ expect }) => {
    expect(1n).toBeTypeOf('bigint')
  })

  test('should be a type of object', ({ expect }) => {
    expect({}).toBeTypeOf('object')
    expect([]).toBeTypeOf('object')
  })

  test('should be a type of function', ({ expect }) => {
    expect(function () {}).toBeTypeOf('function')
  })

  test('should not be a type of number', ({ expect }) => {
    expect('1').not.to.be.typeOf('number')
    expect(1n).not.to.be.typeOf('number')
    expect({}).not.to.be.typeOf('number')
    expect([]).not.to.be.typeOf('number')
    expect(function () {}).not.to.be.typeOf('number')
  })

  test('should not be a type of string', ({ expect }) => {
    expect(1).not.to.be.typeOf('string')
    expect(1n).not.to.be.typeOf('string')
    expect({}).not.to.be.typeOf('string')
    expect([]).not.to.be.typeOf('string')
    expect(function () {}).not.to.be.typeOf('string')
  })

  test('should not be a type of bigint', ({ expect }) => {
    expect(1).not.to.be.typeOf('bigint')
    expect('1').not.to.be.typeOf('bigint')
    expect({}).not.to.be.typeOf('bigint')
    expect([]).not.to.be.typeOf('bigint')
    expect(function () {}).not.to.be.typeOf('bigint')
  })

  test('should not be a type of object', ({ expect }) => {
    expect(1).not.to.be.typeOf('object')
    expect('1').not.to.be.typeOf('object')
    expect(1n).not.to.be.typeOf('object')
    expect(function () {}).not.to.be.typeOf('object')
  })

  test('should not be a type of function', ({ expect }) => {
    expect(1).not.to.be.typeOf('function')
    expect('1').not.to.be.typeOf('function')
    expect(1n).not.to.be.typeOf('function')
    expect({}).not.to.be.typeOf('function')
    expect([]).not.to.be.typeOf('function')
  })
})
