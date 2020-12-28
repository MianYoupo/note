var handler = {
  set:function(target, propKeys, value, receiver) {
    target[propKeys] = receiver
  }
}

var proxy = new Proxy({}, handler)
proxy.foo = 'bar'
console.log(proxy.foo === proxy); // true