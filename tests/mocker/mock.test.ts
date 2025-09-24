import { describe } from 'noba'

const mock = async (path: String, mocks = {}) => {
  const url = await import.meta.resolve(path)
  const mod = await import(url)
}

describe('noba > mock', async ({ test }) => {
  const mockedData = 'mocked data'

  const mockedFs = await mock('./fs.mock', {
    fs: {
      readFileSync: () => mockedData,
    },
  })

  test('should mock an ecma module', async ({ expect }) => {
    const data = mockedFs.readPackageJson()
    expect(data).to.be(mockedData)
  })
})
