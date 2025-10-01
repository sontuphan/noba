import type { MockObject } from './types/generic'
import { detectRuntime } from './utils'
import { parse } from 'acorn'
import escodegen from 'escodegen'

/**
 * Shallow mock to manipulate exports of a module
 * @param url The absolute path to module (e.g. `import.meta.resolve('fs')`)
 * @param mocks The mocked object
 * @returns The mocked module
 */
export const shallowMock = async <T extends MockObject>(
  url: string,
  mocks: Partial<T> = {},
  attributes?: ImportCallOptions,
): Promise<T> => {
  const mod = await import(url, attributes)
  return new Proxy(mod, {
    get(target: T, key: string | symbol) {
      return key in mocks ? mocks[key] : target[key]
    },
  })
}

const _bareMock = async <T extends MockObject>(
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

  /**
   * To CJS libs
   */

  let target: any

  const _createSyntheticModule = exports.createSyntheticModule
  exports.createSyntheticModule = function createSyntheticModule(
    url: string,
    ...args: any[]
  ) {
    const namespace = _createSyntheticModule(url, ...args)
    if (url === resolved.href) target = namespace
    return namespace
  }

  const _setExport = exports.setExport
  exports.setExport = function setExport(
    namespace: any,
    name: string,
    original: any,
  ) {
    if (Object.is(namespace, target) && name in mocks)
      return _setExport(namespace, name, mocks[name])
    return _setExport(namespace, name, original)
  }

  /**
   * To ESM libs
   */

  const declareVar = (name: string, url: string): any => {
    return {
      type: 'VariableDeclarator',
      id: { type: 'Identifier', name },
      init: {
        type: 'MemberExpression',
        computed: true,
        object: {
          type: 'MemberExpression',
          computed: true,
          object: { type: 'Identifier', name: 'globalThis' },
          property: { type: 'Literal', value: url },
        },
        property: { type: 'Literal', value: name },
      },
    }
  }

  const wrapExports = <T extends MockObject>(
    url: string,
    source: string,
    mocks: Partial<T> = {},
  ) => {
    // @ts-ignore
    globalThis[url] = Object.assign(globalThis[url] || {}, mocks)

    const ast = parse(source, { sourceType: 'module', ecmaVersion: 'latest' })
    ast.body = ast.body.map((node) => {
      // Mock var
      if (node.type === 'VariableDeclaration') {
        node.declarations = node.declarations.map((decl) => {
          if (decl.id.type === 'Identifier' && decl.id.name in mocks)
            return declareVar(decl.id.name, url)
          return decl
        })
        return node
      }
      // Mock func
      if (node.type === 'FunctionDeclaration' && node.id.name in mocks) {
        return {
          type: 'VariableDeclaration',
          kind: 'var',
          declarations: [declareVar(node.id.name, url)],
          start: 0,
          end: 0,
        }
      }
      return node
    })

    return escodegen.generate(ast)
  }

  const _createModule = exports.createModule
  exports.createModule = function createModule(
    url: string,
    source: string,
    unknown: any,
    buffer: any,
  ) {
    if (url === resolved.href) source = wrapExports(url, source, mocks)
    return _createModule(url, source, unknown, buffer)
  }

  return async <A>(url: string): Promise<A> => {
    const { exports: mocked } = Module.load(new URL(url))
    return mocked as A
  }
}

const _nodeMock = async <T extends MockObject>(
  specifier: string,
  parent: string,
  mocks: Partial<T> = {},
) => {
  const { default: esmock } = await import('esmock')
  const { resolve } = await import('import-meta-resolve')

  return async <A>(url: string): Promise<A> => {
    return await esmock<A>(
      url,
      parent,
      {},
      { [specifier]: mocks },
      {
        resolver: resolve,
      },
    )
  }
}

/**
 * Deep mock where the mocked module will take effect globally
 * @param specifier The module
 * @param parent Parent path (e.g. `import.meta.url`)
 * @param mocks The mocked object
 * @returns `deepImport` to replace the native `import`
 */
export const deepMock = async <T extends MockObject>(
  specifier: string,
  parent: string,
  mocks: Partial<T> = {},
) => {
  const runtime = detectRuntime()

  if (runtime === 'bare') return _bareMock(specifier, parent, mocks)
  if (runtime === 'node') return _nodeMock(specifier, parent, mocks)
  else throw new Error('Unsupported runtime')
}
