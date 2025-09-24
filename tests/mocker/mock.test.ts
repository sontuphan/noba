import { describe, mock } from 'noba'

describe('noba > mock', async ({ test }) => {
  const mockedData = 'mocked data'

  const mockedFs = await mock<typeof import('./fs.mock')>(
    import.meta.resolve('./fs.mock.js'),
    {
      readPackageJson: () => mockedData,
    },
  )

  test('should mock an ecma module', async ({ expect }) => {
    const data = mockedFs.readPackageJson()
    expect(data).to.be(mockedData)
  })
})
