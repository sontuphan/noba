import { colors } from '../utils'
import Logger from './logger'

export default class Reporter extends Logger {
  private success = 0
  private fail = 0

  private errors: Array<[string, any]> = []

  constructor(private readonly mainId: string, spaces = 2) {
    super(spaces)
  }

  emit = (type: 'json' | 'raw', ...args: any) => {
    console.log(this.mainId, type, ...args)
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
      this.emit('raw', `\n${colors.red}${description}${colors.none}`)
      this.emit('raw', er.stack ? er.stack : er)
    }

    const data = {
      total: this.fail + this.success,
      fail: this.fail,
      success: this.success,
    }
    this.emit('json', JSON.stringify(data))

    return data
  }
}
