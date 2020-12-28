// var proxy = new Proxy({}, {
//   get:function(target, key, receiver){
//     return receiver
//   }
// })

// console.log(proxy.getReceiver == proxy);

// var b = Object.create(proxy)
// console.log(b.a == proxy);
// console.log(b.a == b);

const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable:false,
    configurable:true
  }
})

const handler = {
  get(target, propKey){
    return 'abc'
  }
}

const proxy = new Proxy(target, handler);
console.log(proxy.foo);
console.log(Object.getOwnPropertyDescriptor(proxy, 'foo'));