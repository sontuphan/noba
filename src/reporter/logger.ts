import { colors, uuid } from '../utils'

export default class Logger {
  private groupIds: string[] = []

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

  log = (_msg: any = '', ..._args: any[]): void => {
    throw new Error('The function is not implemented')
  }

  red = (msg: any = '', ...args: any[]) => {
    this.log(`${colors.red}${msg}`, ...args, colors.none)
  }

  green = (msg: any = '', ...args: any[]) => {
    this.log(`${colors.green}${msg}`, ...args, colors.none)
  }

  yellow = (msg: any = '', ...args: any[]) => {
    this.log(`${colors.yellow}${msg}`, ...args, colors.none)
  }

  blue = (msg: any = '', ...args: any[]) => {
    this.log(`${colors.blue}${msg}`, ...args, colors.none)
  }

  purple = (msg: any = '', ...args: any[]) => {
    this.log(`${colors.purple}${msg}`, ...args, colors.none)
  }
}
