import Module, { type LoadOptions } from 'bare-module'
import { URL } from 'bare-url'

// @ts-ignore
import { Addon } from 'bare'
const resolved = Addon.resolve('builtin:bare-module@5.0.3', import.meta.url)
const { exports } = Addon.load(resolved)

export const shallowMock = async <T extends Record<string | symbol, any>>(
  path: string,
  mocks: Partial<T> = {},
): Promise<T> => {
  const url = import.meta.resolve(path)
  const mod = await import(url)
  return new Proxy(mod, {
    get(target: T, key: string | symbol) {
      return key in mocks ? mocks[key] : target[key]
    },
  })
}

export const deepMock = async <T extends Record<string | symbol, any>>(
  specifier: string,
  parent: string,
  mocks: Partial<T> = {},
) => {
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
