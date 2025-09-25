import { describe, mock } from 'noba'

describe('noba > mock', async ({ describe }) => {
  const mockedData = 'mocked data'

  describe('mock on an imported file', async ({ test }) => {
    const mocked = await mock<typeof import('./fs.mock')>(
      import.meta.resolve('./fs.mock.js'),
      {
        readPackageJson: () => mockedData,
      },
    )

    test('should mock a file', async ({ expect }) => {
      const data = mocked.readPackageJson()
      expect(data).to.be(mockedData)
    })
  })

  describe('mock on an imported package', async ({ test }) => {
    const mocked = await mock<typeof import('fs')>(import.meta.resolve('fs'), {
      readFileSync: (): any => mockedData,
    })

    test('should mock a module', async ({ expect }) => {
      const data = mocked.readFileSync('./dummy/path.json', 'utf8')
      expect(data).to.be(mockedData)
    })
  })
})
