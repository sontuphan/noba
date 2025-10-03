/// <reference path="./global.d.ts" />

import { existsSync, renameSync, rmSync } from 'fs'
import process from 'process'
import Runner from './runner'
import { uuid } from './utils'
// @ts-ignore
import setupCoverage from 'bare-cov'

if (!process.env.NOBA_MAIN_ID) process.exit(1)

/**
 * Coverage in Node
 */
if (!!process.env.NODE_V8_COVERAGE) {
  // Ignored. V8 Engine auto detect this flag.
}

/**
 * Coverage in Bare
 */
if (!!process.env.NOBA_BARE_COVERAGE) {
  const dir = process.env.NOBA_BARE_COVERAGE
  setupCoverage({ dir, reporters: ['json'] })

  process.once('exit', () => {
    const v8Json = dir + '/coverage-final.json'
    if (existsSync(v8Json)) rmSync(v8Json)

    const oldDump = `${dir}/v8-coverage.json`
    const newDump = `${dir}/coverage-${uuid(5)}-${Date.now()}.json`
    if (existsSync(oldDump)) renameSync(oldDump, newDump)
  })
}

/**
 * Noba modules
 */
export * from './utils'
export const { describe, test, it } = new Runner(
  process.env.NOBA_MAIN_ID,
  Number(process.env.NOBA_TIMEOUT) || undefined,
)
