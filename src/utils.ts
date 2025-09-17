export const uuid = () => {
  return Math.round(Math.random() * 10 ** 12)
}

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const colors = {
  none: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

export const timer = () => {
  const start = Date.now()
  return () => {
    const end = Date.now() - start
    if (end < 300) return `${colors.green}(${end}ms)${colors.none}`
    else if (end < 1000) return `${colors.yellow}(${end}ms)${colors.none}`
    else return `${colors.red}(${end}ms)${colors.none}`
  }
}
