import process from 'process'
import type { Func } from './types/generic'
import type { Runtime } from './types/runtime'

/**
 * Pseudo-unique id
 * @param length (Optional) The length of id (default: 12)
 * @returns uuid
 */
export const uuid = (length = 12) => {
  if (length <= 0) return ''
  let uid = ''
  while (uid.length < length) {
    const num = Math.floor(Math.random() * 10)
    if (uid || num) uid = uid + num.toString()
  }
  return uid
}

/**
 * Async delay
 * @param ms - Milliseconds
 * @returns
 */
export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Color constants
 */
export const colors = {
  none: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
}

/**
 * The timer calculation
 * @returns Milliseconds
 */
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

/**
 * Race an async
 * @param fn An async function
 * @param ms Time limit
 * @param er Time limit exception message
 * @returns
 */
export const race = async <T>(fn: Func<void, T>, ms: number, er: string) => {
  let id: NodeJS.Timeout

  return Promise.race([
    (async () => await fn())(),
    new Promise(
      (_, reject) => (id = setTimeout(() => reject(new Error(er)), ms)),
    ),
  ]).finally(() => clearTimeout(id))
}

/**
 * Detect the current runtime
 * @returns Runtime
 */
export const detectRuntime = (): Runtime | '' => {
  if (process.versions) {
    if (process.versions.bun) return 'bun'
    if (process.versions.bare) return 'bare'
    if (process.versions.node) return 'node'
  }

  if (typeof Deno !== 'undefined' && typeof Deno.version !== 'undefined')
    return 'deno'
  if (typeof Bun !== 'undefined') return 'bun'
  if (typeof Bare !== 'undefined') return 'bare'

  return ''
}
