const teardown = () => {
  console.log('The teardown is immediate')
}

;(() => {
  teardown()
})()
