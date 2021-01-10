function* bar() {
	yield 'x'
	yield* foo()
	yield 'y'
}

function* foo() {
	yield 'a'
	yield 'b'
}

for(let v of bar()) {
	console.log(v)
}