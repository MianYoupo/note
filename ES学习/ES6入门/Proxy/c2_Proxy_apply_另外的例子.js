var twice = {
  apply: function (target, context, args) {
    // return Reflect.apply(...arguments) * 2 这个等同于下面的写法
    return Reflect.apply(target,context,args) * 2
  }
}

function sum(left, right) {
  return left + right;
}

var proxy = new Proxy(sum, twice)
console.log(proxy(1, 2));

