function* foo() {
	yield 'a'
	yield 'b'
}

function* bar() {
	yield 'x'
	for(let i of foo()) {
		console.log(i)
	}
	yield 'y'
}

for(let v of bar()) {
	console.log(v)
}
/*
x
a
b
y
 */