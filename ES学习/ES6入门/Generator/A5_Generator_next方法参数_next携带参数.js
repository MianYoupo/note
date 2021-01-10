function* f(){
  for(var i = 0;true;i++){
    var reset = yield i;
    if(reset) { i = -1}
  }
}

var generator = f()
console.log(generator.next());
console.log(generator.next());
console.log(generator.next(true));