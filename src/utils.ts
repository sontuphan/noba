export const uuid = () => {
  return Math.round(Math.random() * 10 ** 12)
}

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
