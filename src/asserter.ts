import Logger from './logger'

export default class Asserter {
  constructor(protected readonly logger: Logger) {}

  is = <T>(a: T, b: T) => {
    if (a !== b) {
      this.logger.green('- expect', a)
      this.logger.red('- actual', b)
    }
  }
}
