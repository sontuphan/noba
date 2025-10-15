import { describe } from 'noba'

describe('noba > skip', ({ describe }) => {
  describe.skip('skip describe', ({ test }) => {
    test('should not be reached', ({ expect }) => {
      expect(false).to.be.truthy()
    })
  })

  describe('unskip describe', ({ describe, test }) => {
    test('should not skip test', ({ expect }) => {
      expect(true).to.be.truthy()
    })

    test.skip('should skip failed test', ({ expect }) => {
      expect(false).to.be.truthy()
    })
  })
})
