var handler = {
  defineProperty(target, propKeys, descriptor){
    target[propKeys] = descriptor.value
    return false
  }
}

var target = {}
var proxy = new Proxy(target, handler)
console.log(proxy.foo = 'bar'); 
console.log(proxy);