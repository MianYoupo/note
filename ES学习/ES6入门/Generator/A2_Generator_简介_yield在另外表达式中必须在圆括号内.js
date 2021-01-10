function* demo(){
  console.log('called');
  console.log('hello\n' + (yield 456));
  console.log('hello\n' + (yield 123));
}

var generator = demo()
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());