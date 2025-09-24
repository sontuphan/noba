export { spy, spyOn } from 'tinyspy'

export const mock = async <T extends Record<string | symbol, any>>(
  path: string,
  mocks: Record<string | symbol, any> = {},
) => {
  const mod = await import(path)
  return new Proxy(mod, {
    get(target: T, key) {
      return key in mocks ? mocks[key] : target[key]
    },
  })
}
