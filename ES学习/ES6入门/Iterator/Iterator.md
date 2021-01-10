# Iterator

## 遍历器的概念

js 中表示集合的数据结构, 主要有 Array Object Map Set

Iterator 是一种机制, 是一种接口, 为不同的数据结构提供统一的访问机制

任何数据机构只要部署 Iterator 接口, 就可以完成遍历操作

Iterator 的作用:
1. 为各种数据结构提供统一的接口
2. 使得数据结构成员能够按照某种次序排列
3. Iterator 接口主要为 for...of 

遍历器的一个简化版本

```js
function makeIterator(array) {
  var nextIndex = 0
  return {
    next: function () {
      return nextIndex < array.length
        ? { value: array[nextIndex++] }
        : { done: true }
    },
  };
}
```

Iterator 知识把接口加到数据结构上, 所以遍历器与所遍历的数据结构, 实际上是分开的

> 也就是, 可以写出没有数据结构的遍历器对象, 或者说用遍历器模拟出数据结构

```js
var objTest=  {
  [Symbol.iterator](){
    var index = 0;
    return{
      next:function(){
        if(index>100) return {value:undefined,done:true}
        return {value:index++, done:false}
      }
    }
  }
}

for(var i of objTest) {
  console.log(i)
}
```

## 默认 Iterator 接口

Iterator 接口的目的, 就是为了所有数据结构, 提供了一种统一的访问机制

使用 for...of 循环遍历某种数据结构时, 该循环自动寻找 Iterator 接口

数据结构只要部署了 Iterator 接口, 这种数据结构就是可遍历的

Iterator 协议的特征:
1. 对象具有 [Symbol.iterator] 属性
2. 执行上面的属性, 会返回一个遍历器对象(根本特征是具有 next 方法, 每次调用 next 方法, 都会返回一个对象, 包含 value 和 done 两个属性)

js 中原生具有 Iterator 接口的数据结构如下
- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

Object 类型没有原生 Iterator 接口, 只要在原型链上部署, 就可以使用

下面是另外的一种 Iterator 的部署方式, 将 next 方法部署在实例上

```js
class RangeIterator {
  constructor(start, stop) {
    this.value = start
    this.stop = stop
  }

  [Symbol.iterator]() { return this }

  next() {
    var value = this.value
    if (value < this.stop) {
      this.value++
      return { value: value, done: false }
    }
    return { done: true, value: undefined }
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop)
}

for(var value of range(0,100)){
  console.log(value);
}
```

通过遍历器实现指针结构

下面是一个链表结构, 使用遍历器部署在原型链上, 每次访问 value 指针向后移动

```js
function Obj(value) {
  this.value = value
  this.next = null
}

Obj.prototype[Symbol.iterator] = function () {
  var current = this
  return {
    next: function () {
      if(current == undefined) return {done:true}
      var value = current.value
      current = current.next
      return { value: value, done: false }

    }
  }
}

var one = new Obj(1)
var two = new Obj(2)
var three = new Obj(3)

one.next = two
two.next = three
three.next = undefined

for (var i of one) {
  console.log(i);
}
```

对于类数组对象(存在数值键名和 length 属性), 可以借用 Array 的遍历器

```js
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator]

[...document.querySelectorAll('div')] //可以使用了
```

下面是一个例子:

```js
var iterator = {
  0:'a',
  1:'b',
  2:'c',
  length :3,
  [Symbol.iterator]:[][Symbol.iterator]
}

for(var i of iterator) {
  console.log(i);
}
```

Symbol.iterator 方法对应的不是遍历器生成函数, 会报错

有了遍历器接口, 除了使用 for...of 还可以使用 while 来遍历

## 调用 Iterator 接口的场合

1. 解构赋值

对数组和 Set 结构进行结构赋值时, 会默认调用

2. 拓展运算符

任何部署了 Iterator 接口的数据结构, 都可以使用 ... 转换为数组

3. yield*

yield* 后面跟的可遍历结构, 会调用该结构的遍历器接口

4. 其他场合

数组的遍历会调用遍历器接口, 所以接收数组作为参数的场合, 都调用了遍历器

## 字符串的 Iterator 接口

字符串调用 Iterator 接口的案例

```js
var someString = 'hi'
typeof someString[Symbol.iterator]

var iterator = someString[Symbol.iterator]()

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

可以覆盖原生的 Symbol.iterator 方法, 达到修改遍历器行为的目的

```js
var str = new String('hi')

console.log(...str); //'h','i'

str[Symbol.iterator] = function () {
  return {
    next: function () {
      if (this._first) {
        this._first = false
        return { value: 'bye', done: false }
      } else {
        return { done: true }
      }
    },
    _first: true
  }
}

console.log(...str); //'bye'
```

## Iterator 接口与 Generator 函数

Symbol.iterator() 方法的最简单实现, 是使用 Generator 函数

```js
var iterator = {
  [Symbol.iterator]:function* () {
    yield 1
    yield 2
    yield 3
  }
}
console.log(...iterator); //1 2 3

let obj = {
  *[Symbol.iterator](){
    yield 'hello'
    yield 'world'
  }
}

console.log(...obj); // hello world
```

上面没有部署代码, 只用 yield 命令给出返回值即可

## 遍历器对象的 return() throw()

遍历器对象除了具有 next() 方法, 还可以具有 return() 方法和 throw 方法

遍历器对象, next() 方法是必须部署的, return() 和 throw() 的部署是可选的

return() 方法的使用场合是, 如果 for...of 循环提前退出, 就会调用 return() 方法. 

> 如果一个对象在完成遍历前, 需要清理或者释放资源, 就可以部署 return() 方法

```js
function readLinesSync(file) {
  return {
    [Symbol.iterator](){
      return {
        next() {
          return {done:false}
        },
        return() {
          file.close()
          return {done: true}
        }
      }
    }
  }
}
```

## for...of 循环

ES6 引入 for...of 循环, 作为遍历所有数据结构的统一方法

### 数组

js 元素的 for...in 循环, 只能获得对象的键名, 不能直接获取键值. ES6 提供的 for...of 循环, 允许遍历获得键值

```js
var arr = ['a','b','c','d']

for(var a in arr) {
  console.log(a);
}

for(var i of arr) {
  console.log(i);
}
```

for...of 循环调用遍历器接口, 数组的遍历器只返回具有**数字索引**的属性

```js
var arr = [3,4,5]
arr.foo = 'hello'

for(var i in arr) {
  console.log(i);
}

for(var i of arr) {
  console.log(i);
}
```

### Set 和 Map 结构

Set 和 Map 结构也具有 Iterator 接口

```js
var engines = new Set(['gecko','trident', 'webkit', 'webkit'])
for(var e of engines) {
  console.log(e);
}

var es6 = new Map()

es6.set('edition',6)
es6.set('committee','TC39')
es6.set('standard','ecma-262')

for(var [name, value] of es6) {
  console.log(name + ':' + value);
}
```
遍历的顺序是添加的顺序, 输出方式有差别. set 输出的是值, map 输出的是数组

### 计算生成的数据结构

有些数据接哦古是在现有数据结构的基础上, 计算生成的. 比如 ES6 的数组 Set Map 都部署了以下三个方法, 调用后都返回**遍历器对象**

- entries() 返回遍历器对象, 输出 [键名, 键值]
- keys() 返回遍历器对象, 输出键名
- values() 返回遍历器对象, 输出键值

### 类似数组的对象

对字符串来说 for...of 循环是可以正确识别 32 位 UTF-16 字符

```js
for(let x of 'a\ud83d\udc0a') {
  console.log(x);
}
// a
// 🐊
```

并不是所有类数组的对象都有 Iterator 接口, 可以使用 Array.form 方法将其转换为数组

### 对象

对于普通的对象, for...of 结构不能直接使用, 必须部署 Iterator 接口后才能使用

一种方式是使用 Object.keys() 将对象的键名生成一个数组, 然后遍历这个数组

```js
for(var key of Object.keys(someObject)){
  console.log(key + ':' + someObject[key])
}
```

```js
function* entries(obj) {
  for(let key of Object.keys(obj)){
    yield [key,obj[key]]
  }
}

for(let [key,value] of entries(obj)){
  console.log(key, '->', value)
}
```

## 与其他遍历语法的比较

