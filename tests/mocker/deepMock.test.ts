import { describe } from 'noba'
import { deepMock } from 'noba/mock'

describe('noba > mock', async ({ describe }) => {
  const mockedData = 'mocked data'

  describe('deeply mock', async ({ test }) => {
    const deepImport = await deepMock<typeof import('asciichart')>(
      'asciichart',
      import.meta.url,
      {
        plot: (): any => mockedData,
      },
    )

    test('should deep mock a file', async ({ expect }) => {
      const { readChart } = deepImport<typeof import('./fs.mock')>(
        './fs.mock',
        import.meta.url,
      )
      const data = readChart()
      expect(data).to.be(mockedData)
    })
  })
})
