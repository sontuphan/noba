import process from 'process'
import Runner from './runner'

if (!process.env.ISOTEST_MAIN_ID) process.exit(1)

export const { describe, test, it } = new Runner(
  process.env.ISOTEST_MAIN_ID,
  Number(process.env.ISOTEST_TIMEOUT) || undefined,
)

export * from './utils'
