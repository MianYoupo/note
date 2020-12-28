var target = {
  a:1,
  b:2,
  c:3
}
var handler = {
  ownKeys(target) {
    return ['a']
  }
}

var proxy = new Proxy(target, handler)

console.log(Object.keys(proxy));