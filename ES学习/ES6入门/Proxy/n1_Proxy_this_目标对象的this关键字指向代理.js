var target = {
  m:function(){
    console.log(this === proxy)
  }
}

var handler = {}

var proxy = new Proxy(target, handler)

target.m()

proxy.m()