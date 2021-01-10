function* g() {
}

g.prototype.hello = fucntion() {
  return 'hi'
}

let obj = g()

console.log(obj instanceof g)
obj.hello()