import { plot } from 'asciichart'

export const getChart = () => {
  const s = Array(40)
    .fill(0)
    .map((_, i, a) => 4 * Math.sin(i * ((Math.PI * 4) / a.length)))
  return plot(s)
}
