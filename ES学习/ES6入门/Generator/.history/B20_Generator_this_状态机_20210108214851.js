var clock = function*() {
  while(true) {
    console.log('tick')
    yield
    console.log('tock')
    yield
  }
}