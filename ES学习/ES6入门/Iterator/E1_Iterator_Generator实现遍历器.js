var iterator = {
  [Symbol.iterator]:function* () {
    yield 1
    yield 2
    yield 3
  }
}
console.log(...iterator);

let obj = {
  *[Symbol.iterator](){
    yield 'hello'
    yield 'world'
  }
}

console.log(...obj);