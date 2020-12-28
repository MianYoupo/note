var target = function () {return 'i am the target'}
var handler = {
  apply: function(){
    return 'i am the proxy'
  }
}
var proxy = new Proxy(target, handler)
console.log(proxy());