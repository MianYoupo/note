function* F() {
  this.a = 1;
  yield this.b = 2
  yield this.c = 3
}

var obj = {}
var f = F.call(obj)

f.next()
f.next()
f.next()

console.log(obj.a, obj.b, obj.c)