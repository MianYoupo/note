function Obj(value) {
  this.value = value
  this.next = null
}

Obj.prototype[Symbol.iterator] = function () {
  var current = this
  return {
    next: function () {
      if(current == undefined) return {done:true}
      var value = current.value
      current = current.next
      return { value: value, done: false }

    }
  }
}

var one = new Obj(1)
var two = new Obj(2)
var three = new Obj(3)

one.next = two
two.next = three
three.next = undefined

for (var i of one) {
  console.log(i);
}