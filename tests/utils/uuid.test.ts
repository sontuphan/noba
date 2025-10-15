import { uuid, describe } from 'noba'

describe('utils > uuid', ({ test }) => {
  test('should generate 12-character uuid at default', ({ expect }) => {
    expect(uuid()).toHaveLength(12)
  })

  test('should generate 64-character uuid', ({ expect }) => {
    expect(uuid(64)).toHaveLength(64)
  })
})
