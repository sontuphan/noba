import process from 'process'
import Runner from './runner'

if (!process.env.TARE_MAIN_ID) process.exit(1)

export const { describe, test, it } = new Runner(
  process.env.TARE_MAIN_ID,
  Number(process.env.TARE_TIMEOUT),
)

export * from './utils'
