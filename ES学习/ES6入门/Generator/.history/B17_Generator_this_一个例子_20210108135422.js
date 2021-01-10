function* g() {}

g.prototype.hello = function() {
  return 'hi'
}

let obj = g()

console.log(obj instanceof g)
obj.hello()