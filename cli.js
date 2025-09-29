import process from 'process'
import { spawn, spawnSync } from 'child_process'
import { rmSync, readFileSync } from 'fs'
import { command, flag, footer, description, rest } from 'paparam'

/**
 * Utils
 */

const detectRuntime = () => {
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

const red = (e) => `\x1b[31m${e}\x1b[0m`
const green = (e) => `\x1b[32m${e}\x1b[0m`
const yellow = (e) => `\x1b[33m${e}\x1b[0m`
const blue = (e) => `\x1b[34m${e}\x1b[0m`
const purple = (e) => `\x1b[35m${e}\x1b[0m`

/**
 * CLI
 */

const [, , ...args] = process.argv

const cmd = command(
  purple('noba'),
  description(blue('The test framework for Bare')),
  footer(
    `${blue('For example:')}\n${purple('noba')} -t 3000 ${green(
      './tests/*.test.js - GOOD',
    )}\n${purple('noba')} ${green('./tests/*.test.js')} ${red(
      '-t 3000 - BAD',
    )}`,
  ),
  flag(
    '--timeout|-t <timeout>',
    'Set the test timeout in milliseconds (default: 10000)',
  ),
  flag('--version|-v', 'Show the noba version'),
  flag('--coverage|-c', 'Enable the test coverage'),
  flag(
    '--coverage-dir <directory>',
    'Set the coverage dir for the result (default: coverage)',
  ),
  flag(
    '--coverage-format <text|html>',
    'Set the coverage format for the result (default: text)',
  ),
  flag(
    '--register|-r <runner>',
    'Override the default runner. For example, --register tsx to run tests in typescript.',
  ),
  rest(green('<files>')),
).parse(args)

/**
 * Parse params
 */

const runtime = detectRuntime()

if (!runtime || !cmd) process.exit(1)

const NOBA_MAIN_ID = Math.round(Math.random() * 10 ** 12).toString()
const {
  flags: {
    timeout: NOBA_TIMEOUT = 10000,
    version,
    coverage,
    coverageDir = './coverage',
    coverageFormat = 'text',
    register,
  },
} = cmd

const coverageTmp = `${coverageDir}/tmp`
const files = cmd.rest || []

if (version) {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))

  console.log(purple('noba'), pkg.version)
  process.exit(0)
}

if (coverage) {
  rmSync(coverageTmp, { recursive: true, force: true })
}

/**
 * Spawn a child process
 */

const spawnAsync = (file) => {
  const result = {
    errors: [],
    summary: {
      total: 0,
      fail: 0,
      success: 0,
      exception: 0,
    },
  }

  const filter = (msg, out) => {
    // For example: <123:json> ... </123:json>
    const ipcTag = /<(\d+):([a-z]+)> (.*?) <\/\1:\2>/gs
    const ipcTypes = ['error', 'json', 'log']

    let lastIndex = 0

    for (const match of msg.matchAll(ipcTag)) {
      const [chunk, id, type, data] = match
      const { index } = match

      if (index > lastIndex) {
        const rest = msg.slice(lastIndex, index)
        if (rest !== '\n') out(rest)
      }

      if (id !== NOBA_MAIN_ID || !ipcTypes.includes(type)) continue
      if (type === 'error') result.errors.push(data)
      if (type === 'json') result.summary = JSON.parse(data)
      if (type === 'log') out(data)

      lastIndex = index + chunk.length
    }

    if (lastIndex < msg.length) {
      const rest = msg.slice(lastIndex)
      if (rest !== '\n') return out(rest)
    }
  }

  return new Promise((resolve, reject) => {
    console.log(`\n${yellow(file)}`)

    const env = {
      ...process.env,
      NOBA_TIMEOUT,
      NOBA_MAIN_ID,
    }

    if (coverage) {
      if (runtime === 'node') env.NODE_V8_COVERAGE = coverageTmp
      if (runtime === 'bare') env.NOBA_BARE_COVERAGE = coverageTmp
    }

    const exec = register ? `./node_modules/.bin/${register}` : runtime
    const child = spawn(exec, [file], { env })

    child.on('exit', (code) => (!code ? resolve(result) : reject()))

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')

    child.stdout.on('data', (log) => filter(log, console.log))
    child.stderr.on('data', (log) => filter(log, console.error))
  })
}

/**
 * Main
 */

;(async () => {
  let errors = []

  let total = 0
  let fail = 0
  let success = 0
  let exception = 0

  const start = Date.now()

  for (const file of files) {
    const re = await spawnAsync(file)

    errors = errors.concat(re.errors)

    total += re.summary.total
    fail += re.summary.fail
    success += re.summary.success
    exception += re.summary.exception
  }

  const end = Date.now() - start

  for (const error of errors) {
    console.error(error)
  }

  // Summary test result
  console.log(yellow(`\nNoba ${version} [Env: ${runtime}]`))
  console.log(
    `Run total`,
    blue(`${total} ${total > 1 ? 'tests' : 'test'}`),
    'in',
    blue(`${end / 1000}s:`),
    '\n',
    green(`- ${success}\t${success > 1 ? 'successes' : 'success'}`),
    '\n',
    red(`- ${fail}\t${fail > 1 ? 'fails' : 'fail'}`),
    '\n',
    purple(`- ${exception}\t${exception > 1 ? 'exceptions' : 'exception'}`),
    '\n',
  )

  if (coverage) {
    if (runtime === 'node' || runtime === 'bare')
      spawnSync(
        './node_modules/.bin/c8',
        [
          'report',
          `--temp-directory=${coverageTmp}`,
          `--report-dir=${coverageDir}`,
          `--reporter=${coverageFormat}`,
        ],
        { stdio: 'inherit', shell: true },
      )
  }

  if (fail || exception) return process.exit(1)
  return process.exit(0)
})()
