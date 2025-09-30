import { readFileSync } from 'fs'
import { getChart } from './middle.mock'

export const readPackageJson = (path = './package.json') => {
  const data = readFileSync(path, { encoding: 'utf8' })
  return data
}

export const readChart = () => {
  return getChart()
}
