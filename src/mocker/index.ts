export { spy, spyOn } from 'tinyspy'

export const mock = async <T extends Record<string | symbol, any>>(
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
