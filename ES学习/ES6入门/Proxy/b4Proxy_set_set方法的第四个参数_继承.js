'use strict'
var handler = {
  set: function(target, propKeys, value, receiver){
    target[propKeys] = receiver
  }
}

var proxy = new Proxy({}, handler)
var myObj = {}
Object.setPrototypeOf(myObj, proxy)

myObj.a = 'a'
console.log(myObj.a === myObj);

