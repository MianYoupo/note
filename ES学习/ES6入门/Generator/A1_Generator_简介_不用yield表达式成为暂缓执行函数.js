function* f(){
  console.log('called');
}

var generator = f()

setTimeout(() => {
  generator.next()
}, 2000);