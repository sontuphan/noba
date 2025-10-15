import { describe } from 'noba'

describe('noba > only', ({ describe }) => {
  describe('failed describe', ({ test }) => {
    test('failed test', ({ expect }) => {
      expect(false).to.be.truthy()
    })
  })

  describe.only('only describe', ({ describe, test }) => {
    describe('only test', ({ test }) => {
      test.only('only test', ({ expect }) => {
        expect(true).to.be.truthy()
      })

      test('failed test', ({ expect }) => {
        expect(false).to.be.truthy()
      })
    })

    describe('overrided test', ({ test }) => {
      test.only('only test', ({ expect }) => {
        expect(false).to.be.truthy()
      })

      test.only('overrided only test', ({ expect }) => {
        expect(true).to.be.truthy()
      })
    })
  })
})
