var obj = {}

var proxy = new Proxy(obj, {
  ownKeys: function (target) {
    return [123, true, undefined, null, {}, []]
  }
})
Object.getOwnPropertyNames(proxy) //TypeError: 123 is not a valid property name