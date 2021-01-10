function* gen() {
	yield 1
	yield 2
	yield 3
}

var gen = gen()

console.log(gen.next())
console.log(gen.return('foo')) // {value: 'foo', done: true}
console.log(gen.next())