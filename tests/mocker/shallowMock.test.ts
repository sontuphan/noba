import { describe } from 'noba'
import { shallowMock } from 'noba/mock'

describe('noba > shallowMock', async ({ describe }) => {
  const mockedData = 'mocked data'

  describe('mock on an imported file', async ({ test }) => {
    const mocked = await shallowMock<typeof import('./fs.mock')>(
      './fs.mock.js',
      import.meta.url,
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
    const mocked = await shallowMock<typeof import('fs')>(
      'fs',
      import.meta.url,
      {
        readFileSync: (): any => mockedData,
      },
    )

    test('should mock a module', async ({ expect }) => {
      const data = mocked.readFileSync('./dummy/path.json', 'utf8')
      expect(data).to.be(mockedData)
    })
  })
})
