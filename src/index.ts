import { existsSync, renameSync, rmSync } from 'fs'
import process from 'process'
import Runner from './runner'
import { uuid } from './utils'

if (!process.env.NOBA_MAIN_ID) process.exit(1)

if (!!process.env.NOBA_BARE_COVERAGE) {
  const dir = process.env.NOBA_BARE_COVERAGE

  require('bare-cov')({ dir })

  process.once('exit', () => {
    const v8Json = dir + '/coverage-final.json'

    if (existsSync(v8Json)) rmSync(v8Json)

    const oldDump = `${dir}/v8-coverage.json`
    const newDump = `${dir}/coverage-${uuid(5)}-${Date.now()}.json`

    if (existsSync(oldDump)) renameSync(oldDump, newDump)
  })
}

export const { describe, test, it } = new Runner(
  process.env.NOBA_MAIN_ID,
  Number(process.env.NOBA_TIMEOUT) || undefined,
)

export * from './utils'
