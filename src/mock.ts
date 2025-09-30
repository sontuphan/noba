import type { LoadOptions } from 'bare-module'
import { detectRuntime } from './utils'

/**
 * Shallow mock to manipulate exports of a module
 * @param url The absolute path to module (e.g. `import.meta.resolve('fs')`)
 * @param mocks The mocked object
 * @returns The mocked module
 */
export const shallowMock = async <T extends Record<string | symbol, any>>(
  url: string,
  mocks: Partial<T> = {},
): Promise<T> => {
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
  const { default: Module } = await import('bare-module')
  const { URL } = await import('bare-url')

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
  Module.load = function (url: InstanceType<typeof URL>, opts: LoadOptions) {
    if (url.href === resolved.href) {
      const _setExport = exports.setExport
      exports.setExport = function setExport(
        namespace: any,
        name: string,
        _fn: any,
      ) {
        const fn = name in mocks ? mocks[name] : _fn
        return _setExport(namespace, name, fn)
      }
    }

    return _load(url, opts)
  }

  return <A>(module: string, parent: string): A => {
    const { exports: mocked } = Module.load(
      Module.resolve(module, new URL(parent)),
    )
    return mocked as A
  }
}

const _nodeMock = async <T extends Record<string | symbol, any>>(
  specifier: string,
  parent: string,
  mocks: Partial<T> = {},
) => {
  const { default: Module } = (await import('node:module')) as any

  return <A>(module: string, parent: string): A => {
    return mocks as any
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
  if (runtime === 'node') return _nodeMock(specifier, parent, mocks)
  else throw new Error('Unsupported runtime')
}
