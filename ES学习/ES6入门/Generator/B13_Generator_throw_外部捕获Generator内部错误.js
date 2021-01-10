function* foo() {
	var x = yield 3
	var y = x.toUpperCase()
	yield y
}

var it = foo()
it.next()

try {
	it.next(42)
} catch (err) {
	console.log(err) //typeerror
}