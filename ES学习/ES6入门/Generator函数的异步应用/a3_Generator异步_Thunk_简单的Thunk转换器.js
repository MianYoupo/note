// ES5 版本
var Thunk = function(fn) {
  return function() {
    let arr = Array.prototype.slice(arguments)
    return function(callback) {
      arr.push(callback)
      return fn.apply(this, arr)
    }
  }
}

// ES6 版本
let Thunk = function(fn) {
  return function(...args) {
    return function (callback) {
      return fn.call(this, ...args, callback)
    }
  }
}