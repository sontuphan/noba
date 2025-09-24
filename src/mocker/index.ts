export const mock = async <T extends Record<string | symbol, any>>(
  path: string,
  mocks: Record<string | symbol, any> = {},
) => {
  const url = import.meta.resolve(path)
  const mod = await import(url)
  return new Proxy(mod, {
    get(target: T, key) {
      return key in mocks ? mocks[key] : target[key]
    },
  })
}
