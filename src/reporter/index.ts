import { colors } from '../utils'
import Logger from './logger'

export default class Reporter extends Logger {
  private success = 0
  private fail = 0

  private errors: Array<[string, any]> = []

  constructor(private readonly mainId: string, spaces = 2) {
    super(spaces)
  }

  get tag() {
    return {
      json: `${this.mainId} json ${this.mainId}`,
      error: `${this.mainId} error ${this.mainId}`,
      log: `${this.mainId} log ${this.mainId}`,
      end: this.mainId,
    }
  }

  error = (...ers: any[]) => {
    console.error(this.tag.error, ...ers, this.tag.end)
  }

  json = (data: string) => {
    console.log(this.tag.json, data, this.tag.end)
  }

  override log = (msg: any = '', ...args: any[]): void => {
    console.log(this.tag.log, `${this.spacer}${msg}`, ...args, this.tag.end)
  }

  pass = () => {
    this.success += 1
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
    }
    this.json(JSON.stringify(data))

    return data
  }
}
