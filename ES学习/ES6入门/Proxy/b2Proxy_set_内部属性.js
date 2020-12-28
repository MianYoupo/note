var handler = {
  get:function(target, propKeys) {
    invariant(propKeys, 'get')
    return target[propKeys]
  },
  set:function(target,propKeys,value) {
    invariant(propKeys,'set')
    target[propKeys] = value
    return true //修改属性返回 true
  }
}
//这是一个验证函数, 拦截对内部属性的访问
function invariant(key, action) {
  //只要访问的属性中含有下划线, 一律报错
  if(key[0] === '_') {
    throw new Error(`invalid attempt to ${action} private ${key} property`)
  }
}

var proxy = new Proxy({}, handler)
console.log(proxy._a);  //报错
console.log(proxy.a='a')