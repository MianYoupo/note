var handler = {
  get: function (target, propKeys, receiver) {
    console.log(this === handler)
    return 'hello ' + propKeys
  },
  set: function (target, propKeys, value) {
    console.log(this === handler)
    target[propKeys] = value
    return true
  }
}

var proxy = new Proxy({}, handler)

console.log(proxy.foo);

console.log(proxy.foo = 1);