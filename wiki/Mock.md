A mock is a fake version of a module, function, or object that you use instead of the real one to help isolate and test a piece of code in a controlled way.

By mixing mock and [spy](/sontuphan/noba/wiki/spy), you can verify not only that certain functions were called, but also how they were called and with what arguments. This helps ensure your code interacts with dependencies as expected during testing.

> 💡 Currently mock supports ES modules only.

# Basic Use

## Shallow Mock

A shallow mock replaces the directly exported functions or values from a module. When using `shallowMock`, it returns a mocked version of the module, which you should use in your tests to ensure the mock is active.

```ts
import { describe } from 'noba'
import { shallowMock } from 'noba/mock'

describe('shallowMock', async ({ test }) => {
  const mockedData = 'mocked data'
  const mocked = await shallowMock<typeof import('fs')>(
    import.meta.resolve('fs'),
    {
      readFileSync: (): any => mockedData,
    },
  )

  test('should mock a module', async ({ expect }) => {
    const data = mocked.readFileSync('./dummy/path.json', 'utf8')
    expect(data).to.be(mockedData)
  })
})
```

## Deep Mock

A deep mock replaces not only the directly exported functions or values, but also any nested properties or methods within the module. This is useful when you need to mock complex modules with multiple layers of objects or functions.

Note that `deepMock` won't return a mocked module like `shallowMock`, instead it returns a custom `deepImport` that use can use to import any module that contain the mocked module in its dependency tree.

```ts
// ./chart.util.ts
import { plot } from 'asciichart'

export const getChart = () => {
  const s = Array(40)
    .fill(0)
    .map((_, i, a) => 4 * Math.sin(i * ((Math.PI * 4) / a.length)))
  return plot(s)
}

// ./deepMock.test.ts
import { describe } from 'noba'
import { deepMock } from 'noba/mock'

describe('deeply mock', async ({ test }) => {
  const mockedData = 'mocked data'

  const deepImport = await deepMock<typeof import('asciichart')>(
    'asciichart',
    import.meta.url,
    {
      plot: (): any => mockedData,
    },
  )

  test('should deep mock a file', async ({ expect }) => {
    const { readChart } = await deepImport<typeof import('./chart.util')>(
      import.meta.resolve('./chart.util.ts'),
    )
    const data = readChart()
    expect(data).to.be(mockedData)
  })
})
```
