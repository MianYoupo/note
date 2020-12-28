var target = {
  a: 1,
  b: 2,
  c: 3,
  [Symbol.for('secret')]: 4
}

Object.defineProperty(target, 'key', {
  enumerable: false,
  configurable: true,
  writable: true,
  value: 'static'
})

var handler = {
  ownKeys(target) {
    return ['a','d',Symbol.for('secrte'),'key']
  }
}

var proxy = new Proxy(target, handler)

console.log(Object.keys(proxy));