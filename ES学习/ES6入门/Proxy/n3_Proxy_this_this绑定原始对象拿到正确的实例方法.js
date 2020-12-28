var target = new Date('2012-2-2')
var handler = {
  get(target, propKeys) {
    if(propKeys === 'getDate'){
      return target.getDate.bind(target)
    }
    return Reflect.get(target, propKeys)
  }
}

var proxy = new Proxy(target, handler)

console.log(proxy.getDate());