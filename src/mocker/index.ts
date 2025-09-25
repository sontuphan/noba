export { spy, spyOn } from 'tinyspy'

export const mock = async <T extends Record<string | symbol, any>>(
  path: string,
  mocks: Partial<T> = {},
): Promise<T> => {
  const mod = await import(path)
  return new Proxy(mod, {
    get(target: T, key: string | symbol) {
      return key in mocks ? mocks[key] : target[key]
    },
  })
}
