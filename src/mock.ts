import Module, { type LoadOptions } from 'bare-module'
import { URL } from 'bare-url'
import { detectRuntime } from './utils'

/**
 * Shallow mock to manipulate exports of a module
 * @param specifier The module
 * @param parent Parent path (e.g. `import.meta.url`)
 * @param mocks The mocked object
 * @returns The mocked module
 */
export const shallowMock = async <T extends Record<string | symbol, any>>(
  specifier: string,
  parent: string,
  mocks: Partial<T> = {},
): Promise<T> => {
  const url = import.meta.resolve(specifier, parent)
  const mod = await import(url)
  return new Proxy(mod, {
    get(target: T, key: string | symbol) {
      return key in mocks ? mocks[key] : target[key]
    },
  })
}

const _bareMock = async <T extends Record<string | symbol, any>>(
  specifier: string,
  parent: string,
  mocks: Partial<T> = {},
) => {
  // @ts-ignore
  const { Addon } = await import('bare')
  const { exports } = Addon.load(
    Addon.resolve(
      Object.keys(Addon.cache).find((m) =>
        /^builtin:bare-module@[A-Za-z0-9._-]+$/.test(m),
      ),
      import.meta.url,
    ),
  )

  const resolved = Module.resolve(specifier, new URL(parent))

  if (resolved.href in Module.cache)
    throw new Error(
      `The ${specifier} is already loaded. It's too late to mock.`,
    )

  const _load = Module.load
  Module.load = function (url: URL, opts: LoadOptions): Module {
    if (url.href !== resolved.href) return _load(url, opts)
    const target = _load(url, opts)

    const _setExport = exports.setExport
    exports.setExport = function setExport(
      namespace: any,
      name: string,
      _fn: any,
    ) {
      const fn = name in mocks ? mocks[name] : _fn
      return _setExport(namespace, name, fn)
    }
    return target
  }

  return <A>(module: string, parent: string): A => {
    const { exports: mocked } = Module.load(
      Module.resolve(module, new URL(parent)),
    )
    return mocked as any
  }
}

/**
 * Deep mock where the mocked module will take effect globally
 * @param specifier The module
 * @param parent Parent path (e.g. `import.meta.url`)
 * @param mocks The mocked object
 * @returns `deepImport` to replace the native `import`
 */
export const deepMock = async <T extends Record<string | symbol, any>>(
  specifier: string,
  parent: string,
  mocks: Partial<T> = {},
) => {
  const runtime = detectRuntime()

  if (runtime === 'bare') return _bareMock(specifier, parent, mocks)
  else throw new Error('Unsupported runtime')
}
