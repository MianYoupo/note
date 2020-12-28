'use strict'
var handler = {
  set:function(target, propKeys, value, receiver){
    target[propKeys] = receiver
  }
}

var proxy = new Proxy({}, handler)
proxy.foo = 'bar' //TypeError: 'set' on proxy: trap returned falsish for property 'foo' 