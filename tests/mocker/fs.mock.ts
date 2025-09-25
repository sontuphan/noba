import { readFileSync } from 'fs'

export const readPackageJson = (path = './package.json') => {
  const data = readFileSync(path, { encoding: 'utf8' })
  return data
}
