import type { Func } from './types/generic'

export const uuid = () => {
  return Math.round(Math.random() * 10 ** 12).toString()
}

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const colors = {
  none: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
}

export const timer = () => {
  const start = Date.now()
  return () => {
    const end = Date.now() - start
    if (end < 300)
      return { time: end, message: `${colors.green}(${end}ms)${colors.none}` }
    else if (end < 1000)
      return {
        time: end,
        message: `${colors.yellow}(${end}ms)${colors.none}`,
      }
    else return { time: end, message: `${colors.red}(${end}ms)${colors.none}` }
  }
}

export const race = async <T>(fn: Func<void, T>, ms: number, er: string) => {
  let id: NodeJS.Timeout

  return Promise.race([
    (async () => await fn())(),
    new Promise(
      (_, reject) => (id = setTimeout(() => reject(new Error(er)), ms)),
    ),
  ]).finally(() => clearTimeout(id))
}
