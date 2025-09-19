import process from 'process'
import Runner from './runner'

if (!process.env.NOBA_MAIN_ID) process.exit(1)

export const { describe, test, it } = new Runner(
  process.env.NOBA_MAIN_ID,
  Number(process.env.NOBA_TIMEOUT) || undefined,
)

export * from './utils'
