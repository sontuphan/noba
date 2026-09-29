A mock is a fake version of a module, function, or object that you use instead of the real one to help isolate and test a piece of code in a controlled way.

By mixing mock and [spy](/sontuphan/noba/wiki/spy), you can verify not only that certain functions were called, but also how they were called and with what arguments. This helps ensure your code interacts with dependencies as expected during testing.

> 💡 Mocks work on ES module imports. `deepMock` is available on Node and Bare only.

| Function      | What it replaces                         | Who sees the mock                                   |
| ------------- | ---------------------------------------- | --------------------------------------------------- |
| `shallowMock` | Exports of one module                    | Only the proxy it returns                           |
| `deepMock`    | Exports of a dependency, however deep    | Every module loaded through the returned `deepImport` |

Both are async, so `await` them, typically inside an `async` `describe` callback before registering tests.

# Shallow Mock

`shallowMock(url, mocks, attributes?)` imports the module at `url` and returns a proxy of it where the keys in `mocks` are replaced. Other exports pass through unchanged.

The real module is not modified: code that imports it directly still gets the original. Use the returned object in your tests.

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

`url` must be resolved (for example with `import.meta.resolve`). The optional `attributes` are passed to `import()`, for example `{ with: { type: 'json' } }`.

# Deep Mock

`deepMock(specifier, parent, mocks)` replaces the exports of `specifier` for every module that depends on it, however deep in the dependency tree. This is what you need when the code under test imports the dependency itself.

Unlike `shallowMock`, `deepMock` does not return a mocked module. It returns a `deepImport` function: import the module under test with `deepImport` instead of `import`, and the mock is applied throughout its dependency tree.

- `specifier`: the dependency to replace, as it is written in the `import` statements (e.g. `'asciichart'`).
- `parent`: the URL to resolve `specifier` from, usually `import.meta.url`.
- `mocks`: the exports to replace.

```ts
// ./chart.util.ts
import { plot } from 'asciichart'

export const getChart = () => {
  const s = Array(40)
    .fill(0)
    .map((_, i, a) => 4 * Math.sin(i * ((Math.PI * 4) / a.length)))
  return plot(s)
}
```

```ts
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
    const { getChart } = await deepImport<typeof import('./chart.util')>(
      import.meta.resolve('./chart.util.ts'),
    )
    const data = getChart()
    expect(data).to.be(mockedData)
  })
})
```

On Node, `deepMock` uses [esmock](https://github.com/iambumblehead/esmock). On Bare, it hooks the module loader, so the mock applies to modules loaded after the `deepMock` call.

See [the tests](/sontuphan/noba/tree/master/tests/mock) for working examples.
