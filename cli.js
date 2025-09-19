const process = require('process')
const { spawn } = require('child_process')
const { command, flag, footer, description, rest } = require('paparam')

/**
 * Utils
 */

const red = (e) => `\x1b[31m${e}\x1b[0m`
const green = (e) => `\x1b[32m${e}\x1b[0m`
const yellow = (e) => `\x1b[33m${e}\x1b[0m`
const blue = (e) => `\x1b[34m${e}\x1b[0m`
const purple = (e) => `\x1b[35m${e}\x1b[0m`

const trim = (str) => str.slice(1, -1)

/**
 * CLI
 */

const [, , ...args] = process.argv

const cmd = command(
  purple('tare'),
  description(blue('The test framework for Bare')),
  footer(
    `${blue('For example:')}\n${purple('tare')} -t 3000 ${green(
      './tests/*.test.js - GOOD',
    )}\n${purple('tare')} ${green('./tests/*.test.js')} ${red(
      '-t 3000 - BAD',
    )}`,
  ),
  flag(
    '--timeout, -t <timeout>',
    'Set the test timeout in milliseconds (default: 10000)',
  ),
  rest(green('<files>')),
).parse(args)

/**
 * Parse params
 */

if (!cmd) process.exit(1)

const {
  flags: { timeout: TARE_TIMEOUT },
} = cmd
const files = cmd.rest

/**
 * Spawn a child process
 */

const spawnSync = (file) => {
  const TARE_MAIN_ID = Math.round(Math.random() * 10 ** 12).toString()

  const result = {
    errors: [],
    summary: {
      total: 0,
      fail: 0,
      success: 0,
    },
  }

  const filter = (msg, out) => {
    if (!msg.startsWith(TARE_MAIN_ID)) return out(msg)
    else msg.trim()

    msg
      .split(TARE_MAIN_ID)
      .map((e) => trim(e))
      .filter((e) => !!e)
      .reduce((e, _, i, a) => {
        if (i % 2 === 0) e.push(a.slice(i, i + 2))
        return e
      }, [])
      .forEach(([type, data]) => {
        if (type === 'error') result.errors.push(data)
        if (type === 'json') result.summary = JSON.parse(data)
        if (type === 'log') out(data)
      })
  }

  return new Promise((resolve, reject) => {
    console.log(`\n${yellow(file)}`)

    const child = spawn('bare', [file], {
      env: {
        ...process.env,
        TARE_TIMEOUT,
        TARE_MAIN_ID,
      },
    })

    child.on('exit', (code) => {
      if (!code) return resolve(result)
      return reject()
    })

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

  const start = Date.now()
  for (const file of files) {
    const re = await spawnSync(file)
    errors = errors.concat(re.errors)
    total += re.summary.total
    fail += re.summary.fail
    success += re.summary.success
  }
  const end = Date.now() - start

  for (const error of errors) {
    console.error(error)
  }

  console.log(
    `\nRun total`,
    blue(`${total} test${total > 1 ? 's' : ''}`),
    'in',
    blue(`${end / 1000}s:`),
    '\n',
    green(`- ${success} success${success > 1 ? 'es' : ''}`),
    '\n',
    red(`- ${fail} fail${fail > 1 ? 's' : ''}`),
    '\n',
  )

  if (fail) return process.exit(1)
  return process.exit(0)
})()
