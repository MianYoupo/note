var myIterator = {}

myIterator[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
}

console.log([...myIterator]);