import Runner from './runner'
import Expect from './expect'

const runner = new Runner()

export const { describe, test } = runner
export const expect = <T>(t: T) => new Expect(t)

export * from './utils'
