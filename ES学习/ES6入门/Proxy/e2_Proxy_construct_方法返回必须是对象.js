var proxy = new Proxy(function(){}, {
  construct:function(target, args){
    return 1;
  }
})

console.log(new proxy()); //TypeError: 'construct' on proxy: trap returned non-object ('1')