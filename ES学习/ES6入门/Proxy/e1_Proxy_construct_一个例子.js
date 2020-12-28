var proxy = new Proxy(
  function () { },
  {
    construct: function (target, args) {
      console.log('called:' + args.join(', '))
      return { value: args[0] * 10 }
    }
  }
)

console.log((new proxy(1)).value);