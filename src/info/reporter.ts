import { colors } from '../utils'

export default class Reporter {
  private success = 0
  private fail = 0

  private errors: Array<[string, any]> = []

  pass = () => {
    this.success += 1
  }

  catch = (description: string, er: any) => {
    this.fail += 1
    this.errors.push([description, er])
  }

  report = () => {
    for (const [description, er] of this.errors) {
      console.log(`\n${colors.red}%s${colors.none}`, description)
      if ('stack' in er) console.error(er.stack)
      else console.error(er)
    }

    const fail = this.fail
    const success = this.success
    const total = success + fail
    console.log(
      `\n${colors.blue}Total ${total} test${total > 1 ? 's' : ''}:${
        colors.none
      }`,
      `${colors.green}${success} success${success > 1 ? 'es' : ''}${
        colors.none
      },`,
      `${colors.red}${fail} fail${fail > 1 ? 's' : ''}${colors.none}`,
    )
  }
}
