var handler = {
  deleteProperty(target, propKeys) {
    invariant(propKeys, 'delete')
    delete target[propKeys]
    return true
  }
}

function invariant(propKeys, action){
  if(propKeys[0] === '_') {
    throw new Error(`invalid attempt to ${action}`)
  }
}

var target = {_prop:'foo'}
var proxy = new Proxy(target, handler)
console.log(delete proxy._prop);