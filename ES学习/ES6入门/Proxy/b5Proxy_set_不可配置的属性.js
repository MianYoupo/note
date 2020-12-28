var obj = {};
Object.defineProperty(obj, 'foo',{
  //value 默认 undefined
  writable:false
})
var handler = {
  set: function(target, propKeys, value, receiver){
    target[propKeys] = 'baz'
  }
}

var proxy = new Proxy(obj, handler)

proxy.foo = 'a'
console.log(proxy.foo);