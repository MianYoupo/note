function* F() {
  this.a = 1
  yield this.b = 2
  yield this.c = 3
}

var f = F.call(F.prototype)

f.next()
f.next()
f.next()

console.log(f.a);
Console.log(f.b);
console.log(f.c);
   
xyz
xyz