# Proxy

Proxy 可以理解成在对象前架设一层拦截, 在对对象访问之前都必须通过这层拦截

构造函数语法:

```js
var proxy = new Proxy(target, handler)
// target 是目标对象, handler 也是一个对象, 用来定制拦截行为 
```

```js
var proxy = new Proxy({}, {
  get: function(target, propKey){
    return 35;
  }
})

console.log(proxy.time)
console.log(proxy.name);
```

如果要使拦截操作生效, 必须针对 Proxy 实例进行操作

将 Proxy 对象, 设置到 object.proxy 属性上, 从而可以在 object 对象上调用

```js
var object = {proxy: new Proxy(target, handler)}
```

Proxy 实例可以作为其他对象的原型对象

```js
var object = Object.create(proxy)
```

在一个 handler 对象中可以设置多个处理函数

```js
var handler = {
  get: function (target, name) {
    if (name = 'prototype') {
      return Object.prototype;
    }
    return 'hello' + name
  },
  
  apply: function (target, thisBinding, args) {
    return args[0]
  },
  
  construct: function (target, args) {
    return { value: args[1] }
  }
};
var fproxy = new Proxy(function (x, y) {
  return x + y;
}, handler)

console.log(fproxy(1, 2));
console.log(fproxy.ptototype);
console.log(fproxy.foo);
console.log(new fproxy(1, 2));
```

## Proxy 实例方法

## get()

get 方法拦截某个属性的**读取操作**, 接收三个参数, 最后的参数可选(目标对象, 属性名, proxy实例本身)

```js
var person = {
  name:'zhangsan'
}

var proxy = new Proxy(person, {
  get:function(target,propKey) {
    if(propKey in target) {
      return target[propKey]
    } else {
      throw new ReferenceError('error')
    }
  }
})

console.log(proxy.name);
console.log(proxy.age);
```

如果以 Proxy 对象作为原型对象, 那么拦截也可以继承

设置 Proxy 后, 带到将函数名链式调用的效果

在 node 中无法从全局中访问 funcStack 的函数

```js
var pipe = function (value) {
  var funcStack = [];
  var oproxy = new Proxy({} , {
    get : function (pipeObject, fnName) {
      if (fnName === 'get') {
        return funcStack.reduce(function (val, fn) {
          return fn(val);
        },value);
      }
      funcStack.push(window[fnName]);
      return oproxy;
    }
  });

  return oproxy;
}

var double = n => n * 2;
var pow    = n => n * n;
var reverseInt = n => n.toString().split("").reverse().join("") | 0;

pipe(3).double.pow.reverseInt.get; // 63
```

可以使用 get 拦截, 实现一个生成各种 DOM 节点的通用函数 dom

```js
const dom = new Proxy({}, {
  get(target, propKeys) {
    return function (attrs = {}, ...children) {
      var el = document.createElement(propKeys)
      //遍历 attrs 对象中的 keys
      for(var prop of Object.keys(attrs)){
        el.appendChild(prop,attrs[prop])
      }
      //遍历 children 属性, 将 string 类型添加到 el 节点上去
      for (var child of children) {
        if (typeof child == 'string') {
          child = document.createTextNode(child)
        }
        el.appendChild(child)
      }
      return el;
    }
  }
})
```

get 方法的第三个参数的例子, 它总是指向原始的**读操作**所在的那个对象

```js
var proxy = new Proxy({}, {
  get:function(target, key, receiver){
    return receiver
  }
})

console.log(proxy.getReceiver == proxy); // true

var b = Object.create(proxy)

console.log(b.a == proxy) // false
console.log(b.a == b) // true, 虽然调用的是 proxy 的方法, 但是 receiver 指向的是 b
```

如果一个属性不可配置且不可写, 则 Proxy 不能修改该属性, 会报错

```js
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable:false,
    configurable:true
  }
})

const handler = {
  get(target, propKey){
    return 'abc'
  }
}

const proxy = new Proxy(target, handler);
console.log(proxy.foo);
console.log(Object.getOwnPropertyDescriptor(proxy, 'foo'));
```

## set()

set 方法用来拦截对象属性的赋值操作, 接收四个参数, 目标对象, 属性名, 属性值和 Proxy 实例

```js
var validator = {
  set:function(obj, propKeys, value) {
    if (propKeys == 'age') {
      if (!Number.isInteger(value)) throw new TypeError('the age is not a integer')
      if (value > 200) throw new RangeError('the age seems invalid')
      obj[propKeys] = value
    }
  }
}

var person = new Proxy({}, validator)
person.age = 300
```
以上代码, 设置了存值函数 set, 任何不符合要求的 age 属性赋值, 都会抛出一个错误, 这是数据验证的一种实现方法.

利用 set 方法, 还可以实现数据绑定, 每当对象发生变化时, 会自动更新 DOM

对象上的内部属性, 可以结合 get 和 set 方法, 防止这些内部属性被外部读写

```js
var handler = {
  get:function(target, propKeys) {
    invariant(propKeys, 'get')
    return target[propKeys]
  },
  set:function(target,propKeys,value) {
    invariant(propKeys,'set')
    target[propKeys] = value
    return true //修改属性返回 true
  }
}
//这是一个验证函数, 拦截对内部属性的访问
function invariant(key, action) {
  //只要访问的属性中含有下划线, 一律报错
  if(key[0] === '_') {
    throw new Error(`invalid attempt to ${action} private ${key} property`)
  }
}

var proxy = new Proxy({}, handler)
console.log(proxy._a);  //报错
console.log(proxy.a='a')
```

set 方法第四个参数指向 **操作行为所在的对象**

```js
var handler = {
  set:function(target, propKeys, value, receiver) {
    target[propKeys] = receiver
  }
}

var proxy = new Proxy({}, handler)
proxy.foo = 'bar'
console.log(proxy.foo === proxy); // true
```

下面是继承的例子

```js
var handler = {
  set: function(target, propKeys, value, receiver){
    target[propKeys] = receiver
  }
}

var proxy = new Proxy({}, handler)
var myObj = {}
Object.setPrototypeOf(myObj, proxy)

myObj.a = 'a'
console.log(myObj.a === myObj);
```

同 get 方法, 对于 set 的方法, 如果对象自身的属性, 不可写不可配置, 那么 set 不起作用

```js
var obj = {};
Object.defineProperty(obj, 'foo',{
  writable:false
})
var handler = {
  set: function(target, propKeys, value, receiver){
    target[propKeys] = 'baz'
  }
}

var proxy = new Proxy(obj, handler)

proxy.foo = 'a'
console.log(proxy.foo);
```

在严格模式下, set 代理返回的不是 true, 就报错

```js
'use strict'
var handler = {
  set:function(target, propKeys, value, receiver){
    target[propKeys] = receiver
  }
}

var proxy = new Proxy({}, handler)
proxy.foo = 'bar' //TypeError: 'set' on proxy: trap returned falsish for property 'foo' 
```

## apply()

apply() 方法拦截函数的调用, call 和 apply 操作

apply() 接收三个参数, 目标对象, 目标对象的上下文对象(this), 目标对象的参数数组

```js
var target = function () {return 'i am the target'}
var handler = {
  apply: function(){
    return 'i am the proxy'
  }
}
var proxy = new Proxy(target, handler)
console.log(proxy());
```

上面的代码, 在调用 proxy 对象中的方法时, proxy 拦截了原有函数的动作

```js
var twice = {
  apply: function (target, context, args) {
    //这里不是很懂
    return Reflect.apply(...arguments) * 2
  }
}

function sum(left, right) {
  return left + right;
}

var proxy = new Proxy(sum, twice)
console.log(proxy(1, 2));
```

## has()

has() 方法用来拦截 HasProperty 操作, 在判断对象是否具有某个属性时, 方法生效, 比如 in 操作符

has() 方法接收两个参数, 目标对象, 属性名

下面使用 has() 方法隐藏一些属性, 可以不被 in 操作符发现, 但是**不对** for...in 有效

```js
var handler = {
  has:function(target, propKeys) {
    if(propKeys[0] === '_') {
      return false
    }
    return propKeys in target
  }
}

var target = {_prop:'foo',prop:'bar'}
var proxy = new Proxy (target, handler)

for(var i in proxy) {
  console.log(i); //被遍历到了
}

console.log('_prop' in proxy); //false
console.log(Reflect.has(proxy,'_prop')); //false
```

同 get set 方法, 如果对象属性不可配置, has 方法不得隐藏目标对象的属性, 见下面代码

```js
var obj = {a:10}

Object.preventExtensions(obj) //对象不可拓展

var proxy = new Proxy(obj, {
  has: function(target, propKeys){
    return false
  }
})

'a' in proxy //TypeError
```

has() 方法不对 for...in 方法生效

```js
let stu1 = {name:'zhangsan', score: 59}
let stu2 = {name:'lisi', score: 99}

let handler = {
  has(target, propKeys) {
    if(propKeys === 'score' && target[propKeys] < 60) {
      console.log(`${target.name}不及格`);  
      return false
    }
    return propKeys in target
  }
}

let proxy1 = new Proxy (stu1, handler)
let proxy2 = new Proxy(stu2, handler)

console.log('score' in proxy1);

console.log('score' in proxy2);

for(let a in proxy1) {
  console.log(proxy1[a]);
}

for(let b in proxy2){
  console.log(proxy2[b]);
}
```

## construct()

用来拦截 new 命令

construct() 方法接收三个参数, 目标对象, 参数数组, 创造实例时 new 命令作用的构造函数

下面是一个例子

```js
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
```

construct() 方法返回的必须是对象, 否则报错

```js
var proxy = new Proxy(function(){}, {
  construct:function(target, args){
    return 1;
  }
})

console.log(new proxy()); //TypeError: 'construct' on proxy: trap returned non-object ('1')
```

construct() 方法拦截的是构造函数, 目标对象必须是函数, 否则报错

```js
var proxy = new Proxy({}, {
  construct: function(target, args){
    return {}
  }
})

console.log(new proxy()); //TypeError: proxy is not a constructor
```

## deleteProperty()

deleteProperty() 拦截 delete 操作, 如果方法返回 false 或者抛出错误, 当前属性就无法删除

下面是一个例子

```js
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
console.log(delete proxy._prop); //Error: invalid attempt to delete
```

目标自身的不可配置属性, 不能被 deleteProperty 方法代理, 会报错

## defineProperty()

defineProperty() 方法拦截 Object.defineProperty() 操作, 虽然返回 false 但是并不会阻止添加属性这一操作

```js
var handler = {
  defineProperty(target,propKeys, descriptor){
    target[propKeys] = descriptor.value
    return false //虽然, 返回 false 但是没有阻止添加属性这一操作
  }
}

var target = {}
var proxy = new Proxy(target, handler)
console.log(proxy.foo = 'bar'); 
console.log(proxy);
```

如果目标对象 non-extensible, 那么 defineProperty 无法操作

## getOwnPropertyDescriptor()

getOwnPropertyDescriptor() 方法拦截 Object.getOwnPropertyDescriptor(), 返回一个属性描述对象或者 undefined

```js
var handler = {
  getOwnPropertyDescriptor(target, propKeys) {
    if (propKeys[0] === '_') {
      return
    }
    return Object.getOwnPropertyDescriptor(target, propKeys)
  }
}

var target = { _foo: 'bar', baz: 'tar' }
var proxy = new Proxy(target, handler)

console.log(Object.getOwnPropertyDescriptor(proxy, 'wat')); //undefined
console.log(Object.getOwnPropertyDescriptor(proxy, 'baz'));
console.log(Object.getOwnPropertyDescriptor(proxy, '_foo'));
```

## getPrototypeOf()

getPrototypeOf() 方法用来拦截获取对象原型, 主要是以下这些方法

- Object.prototype.__proto__
- Object.prototype.isPrototypeOf()
- Object.getPrototypeOf()
- Reflect.getPrototypeOf()
- instanceof

```js
var proto = {}
var proxy = new Proxy({}, {
  getPrototypeOf(target){
    return proto
  }
})
console.log(Object.getPrototypeOf(proxy) === proto); // true
```

上面代码拦截了 Object.getPrototypeOf() 方法, 返回 proto 对象

## isExtensible()

isExtensible() 方法拦截 Object.isExtensible() 操作

```js
var proxy = new Proxy({}, {
  isExtensible: function (target) {
    console.log('called');
    return true
  }
})

console.log(Object.isExtensible(proxy));
```

> 这个方法必须返回与目标对象相同的 isExtensible 属性, 否则报错

## ownKeys()

ownKeys() 方法用来拦截对象自身属性的读取操作

- Object.getOwnPropertyNames()
- Object.getOwnPropertySymbols()
- Object.keys()
- for...in

```js
var target = {
  a:1,
  b:2,
  c:3
}
var handler = {
  ownKeys(target) {
    return ['a']
  }
}

var proxy = new Proxy(target, handler)

console.log(Object.keys(proxy));
```

使用 Object.keys() 方法时, 有三类属性会被自动过滤, 不会返回

- 目标对象不存在的属性
- symbol
- 不可遍历

```js
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
```

ownKeys() 方法返回的数组成员, 只能是 string 或者 Symbol, 其他类型报错

```js
var obj = {}

var proxy = new Proxy(obj, {
  ownKeys: function (target) {
    return [123, true, undefined, null, {}, []]
  }
})
Object.getOwnPropertyNames(proxy) //TypeError: 123 is not a valid property name
```

如果对象自身包含不可配置属性, 该属性必须被 ownKeys() 方法返回, 否则报错

如果目标对象是不可拓展的, ownKeys() 方法返回的数组**必须包含原有对象的所有属性**, 且不能有多余属性, 否则报错

## preventExtensions()

preventExtensions() 方法拦截 Object.preventExtensions(), 该方法必须返回一个布尔值, 否则自动隐式转换布尔值

该方法只有目标对象不可拓展时, 才可以返回 true, 否则报错

```js
var proxy = new Proxy({}, {
  preventExtensions: function(target) {
    return true
  }
})

console.log(Object.preventExtensions(proxy)); //TypeError: 'preventExtensions' on proxy: trap returned truish but the proxy target is extensible   
```

只要在代码中将目标函数, 设置成不可拓展即可

## setPrototypeOf()

拦截 Object.setPrototypeOf() 方法

该方法只能返回布尔值, 否则会被自动转为布尔值.

目标对象不可拓展, setPrototypeOf() 方法不能改变对象原型

## this 问题

Proxy 可以代理针对目标对象的访问, 但是它不是目标对象的**透明代理**(不做任何拦截的情况下, 保证与目标对象的行为一致)

主要原因是在 Proxy 代理的情况下, **目标对象**内部的 this 关键字会指向 Proxy 代理

```js
var target = {
  m:function(){
    console.log(this === proxy)
  }
}

var handler = {}

var proxy = new Proxy(target, handler)

target.m() //false

proxy.m() //true
```

下面是, 由于 this 指向的变化, 导致 Proxy 无法代理目标随想

```js
var _name = new WeakMap()

class Person {
  constructor(name) {
    _name.set(this, name)
  }
  get name(){
    return _name.get(this)
  }
}

var jane = new Person('Jane')
console.log(jane.name);

var proxy = new Proxy(jane, {})
console.log(proxy.name); //undefined
```

有些原生对象的内部属性, 只有通过正确的 this 才能拿到, 

```js
var target = new Date('2012-2-2')
var handler = {
  get(target, propKeys) {
    if(propKeys === 'getDate'){
      return target.getDate.bind(target)
    }
    return Reflect.get(target, propKeys)
  }
}

var proxy = new Proxy(target, handler)

console.log(proxy.getDate());
```

Proxy 拦截函数内部的 this, 指向的是 handler 对象, **注意与上面的被拦截对象内部的this区别**

```js
var handler = {
  get: function (target, propKeys, receiver) {
    console.log(this === handler)
    return 'hello ' + propKeys
  },
  set: function (target, propKeys, value) {
    console.log(this === handler)
    target[propKeys] = value
    return true
  }
}

var proxy = new Proxy({}, handler)

console.log(proxy.foo);

console.log(proxy.foo = 1);
```
