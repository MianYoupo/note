var proxy = new Proxy({}, {
  construct: function (target, args) {
    return {}
  }
})

console.log(new proxy());