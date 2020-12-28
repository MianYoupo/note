var proxy = new Proxy({}, {
  preventExtensions: function(target) {
    // Object.preventExtensions(target)
    return true
  }
})

console.log(Object.preventExtensions(proxy));