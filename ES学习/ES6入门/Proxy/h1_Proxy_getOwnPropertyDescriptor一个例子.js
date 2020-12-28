var handler = {
  getOwnPropertyDescriptor(target, propKeys) {
    if (propKeys[0] === '_') {
      return
    }
    return Object.getOwnPropertyDescriptor(target, propKeys)
  }
}

var target = { _foo: 'bar', baz: 'tar' }
var proxy = new Proxy(target, handler)

console.log(Object.getOwnPropertyDescriptor(proxy, 'wat')); //undefined
console.log(Object.getOwnPropertyDescriptor(proxy, 'baz')); //字面量生成对象的属性描述符均为 true
console.log(Object.getOwnPropertyDescriptor(proxy, '_foo')); //undefined