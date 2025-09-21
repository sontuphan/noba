import { existsSync, renameSync, rmSync } from 'fs'
import process from 'process'
import Runner from './runner'

if (!process.env.NOBA_MAIN_ID) process.exit(1)

if (process.env.NOBA_COVERAGE === 'true') {
  if (process.env.NOBA_COVERAGE_FORMAT === 'json') {
    // TODO
  }
  require('bare-cov')({
    dir: process.env.NOBA_COVERAGE_DIR,
  })

  process.once('exit', () => {
    const v8Json = process.env.NOBA_COVERAGE_DIR + '/coverage-final.json'

    if (existsSync(v8Json)) rmSync(v8Json)

    const oldDump = `${process.env.NOBA_COVERAGE_DIR}/v8-coverage.json`
    const newDump = `${
      process.env.NOBA_COVERAGE_DIR
    }/coverage-${Date.now()}.json`

    if (existsSync(oldDump)) renameSync(oldDump, newDump)
  })
}

export const { describe, test, it } = new Runner(
  process.env.NOBA_MAIN_ID,
  Number(process.env.NOBA_TIMEOUT) || undefined,
)

export * from './utils'
