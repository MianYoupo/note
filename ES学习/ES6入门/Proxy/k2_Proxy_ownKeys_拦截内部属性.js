var target = {
  _bar:'foo',
  _prop:'bar',
  prop:'baz'
}

var handler = {
  ownKeys(target) {
    return Reflect.ownKeys(target).filter(key => key[0] !== '_')
  }
}

var proxy = new Proxy(target, handler)

for(var key of Object.keys(proxy)) {
  console.log(proxy[key]);
}