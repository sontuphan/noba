import { uuid } from './utils'

export default class Logger {
  private groupIds: number[] = []
  constructor(private readonly spaces = 2) {}

  get spacer() {
    return ' '.repeat(this.spaces).repeat(this.groupIds.length)
  }

  group = () => {
    const id = uuid()
    this.groupIds.push(id)

    return () => {
      const index = this.groupIds.findIndex((i) => i === id)
      if (index < 0) throw new Error('The group is already closed.')
      this.groupIds.splice(index)
    }
  }

  log = (msg: any = '', ...args: any[]) => {
    console.log(`${this.spacer}${msg}`, ...args)
  }

  red = (msg: any = '', ...args: any[]) => {
    this.log(`\x1b[31m${msg}`, ...args, '\x1b[0m')
  }

  green = (msg: any = '', ...args: any[]) => {
    this.log(`\x1b[32m${msg}`, ...args, '\x1b[0m')
  }

  yellow = (msg: any = '', ...args: any[]) => {
    this.log(`\x1b[33m${msg}`, ...args, '\x1b[0m')
  }

  blue = (msg: any = '', ...args: any[]) => {
    this.log(`\x1b[34m${msg}`, ...args, '\x1b[0m')
  }
}
