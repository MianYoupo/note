function thunkify(fn) {
  return function() {
    var args = new Array(arguments.length)
    var ctx = this
    
    for (let i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    return function(done) {
      var called
      args.push(function(){
        if(called) return 
        called = false
        done.apply(null, arguments)
      })

      try {
        fn.apply(ctx, args)
      } catch (err) {
        done(err)
      }
    }
  }
}