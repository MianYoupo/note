var handler = {
  has:function(target, propKeys) {
    if(propKeys[0] === '_') {
      return false
    }
    return propKeys in target
  }
}

var target = {_prop:'foo',prop:'bar'}
var proxy = new Proxy (target, handler)
for(var i in proxy) {
  console.log(i);
}
console.log('_prop' in proxy);
// console.log(Object.has(proxy,'_prop'));
console.log(Reflect.has(proxy,'_prop'));
