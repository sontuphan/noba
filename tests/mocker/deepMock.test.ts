import { describe } from 'noba'
import { deepMock } from 'noba/mock'
import esmock from 'esmock'

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
      const { readChart } = await deepImport<typeof import('./fs.mock')>(
        import.meta.resolve('./fs.mock.js'),
      )
      const data = readChart()
      expect(data).to.be(mockedData)
    })
  })
})
