import { colors } from '../utils'
import Logger from './logger'

export default class Reporter extends Logger {
  private success = 0
  private fail = 0
  private exception = 0

  private errors: Array<[string, any]> = []

  constructor(private readonly mainId: string, spaces = 2) {
    super(spaces)
  }

  get tag() {
    return {
      json: [`<${this.mainId}:json>`, `</${this.mainId}:json>`],
      error: [`<${this.mainId}:error>`, `</${this.mainId}:error>`],
      log: [`<${this.mainId}:log>`, `</${this.mainId}:log>`],
    }
  }

  error = (...ers: any[]) => {
    const [open, close] = this.tag.error
    console.error(open, ...ers, close)
  }

  json = (data: string) => {
    const [open, close] = this.tag.json
    console.log(open, data, close)
  }

  override log = (msg: any = '', ...args: any[]): void => {
    const [open, close] = this.tag.log
    console.log(open, `${this.spacer}${msg}`, ...args, close)
  }

  pass = () => {
    this.success += 1
  }

  uncatch = (description: string, er: any) => {
    this.exception += 1
    this.errors.push([description, er])
  }

  catch = (description: string, er: any) => {
    this.fail += 1
    this.errors.push([description, er])
  }

  report = () => {
    for (const [description, er] of this.errors) {
      this.error(`\n${colors.red}${description}${colors.none}`)
      this.error(er.stack ? er.stack : er)
    }

    const data = {
      total: this.fail + this.success,
      fail: this.fail,
      success: this.success,
      exception: this.exception,
    }
    this.json(JSON.stringify(data))

    return data
  }
}
