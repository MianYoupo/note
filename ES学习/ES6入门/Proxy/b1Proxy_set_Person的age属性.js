
var validator = {
  set:function(obj, propKeys, value) {
    if (propKeys == 'age') {
      if (!Number.isInteger(value)) throw new TypeError('the age is not a integer')
      if (value > 200) throw new RangeError('the age seems invalid')
      obj[propKeys] = value
    }
  }
}

var person = new Proxy({}, validator)
person.age = 300