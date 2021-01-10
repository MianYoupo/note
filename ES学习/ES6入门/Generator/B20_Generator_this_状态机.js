var clock = function*() {
  while(true) {
    console.log('tick')
    yield
    console.log('tock')
    yield
  }
}
var get = clock()
get.next()
get.next()
get.next()
get.next()