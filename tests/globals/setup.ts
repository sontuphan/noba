import { delay } from 'noba'

const setup = async () => {
  delay(1000)
  console.log('The setup spent 1s')
}

;(async () => {
  await setup()
})()
