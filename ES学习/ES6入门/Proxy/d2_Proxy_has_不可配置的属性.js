var obj = {a:10}

Object.preventExtensions(obj) //对象不可拓展

var proxy = new Proxy(obj, {
  has: function(target, propKeys){
    return false
  }
})

'a' in proxy //TypeError