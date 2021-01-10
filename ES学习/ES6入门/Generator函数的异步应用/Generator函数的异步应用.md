# Generator 函数的异步应用

## 传统方法

ES6 以前, 异步编程的方法, 以下:

1. 回调函数
2. 事件监听
3. 发布/订阅
4. Promise 对象

## 基本概念

js 语言对异步编程的实现, 就是回调函数

把任务的第二段单独写在一个函数里面, 等到执行完成这个任务的时候, 就直接调用这个函数,

例如读取文件的处理

```js
fs.readFile("src", "uft-8", function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

> node 约定, 回调函数的第一个参数, 必须是错误对象 err
>
> 第一段任务执行完以后, 任务所在的上下文环境已经结束了, 在这以后抛出的错误, 原来的上下文环境无法捕捉, 只能当作参数传入第二段

### Promise

Promise 的写法只是回调函数的改进, 使用 then 方法以后, 异步任务的两段执行更加直观

## Generator 函数

协程的运行流程:

1. 第一步, 协程 A 开始执行
2. 第二部, 协程 A 执行到一半, 执行权转移到协程 B
3. 协程 B 交还执行权
4. 协程 A 恢复执行

### 协程的 Generator 函数实现

Generator 函数不同于普通函数的一个地方, 就是执行后不会返回结果, 而是返回的遍历器对象

### Generator 函数的数据交换和错误处理

Generator 函数的两个特性:

1. 函数体内外的数据交换机制
2. 错误处理机制

next 返回值的 value 属性, 是 Generator 函数向外输出数据, next 方法可以接受参数, 向 Generator 函数体内输入数据

Generator 函数内部可以部署处理错误的代码, 捕获函数体外抛出的错误

### 异步的封装

Generator 函数将异步操作表示的很简洁, 但是流程管理不方便

## Thunk 函数

Thunk 函数是自动执行 Generator 函数的一种方法

### 参数的求值策略

1. 一种是传值调用

这种会存在性能损失, 存在传入根本不会用到的参数

2. 传名调用

在执行的时候才会求值

### Thunk 函数的含义

传名调用的实现, 时将参数放到一个临时函数之中, 将这个临时函数传入函数体, 这个临时函数叫做 Thunk 函数

```js
function f(m) {
  return m * 2;
}

f(x + 5);

var thunk = function () {
  return x + 5;
};

function f(thunk) {
  return thunk() * 2;
}
```

### JavaScript 语言的 Thunk 函数

js 语言是传值调用, 在 js 语言中 Thunk 函数替换的不是表达式, 而是**多参函数**, 将其替换成一个只接受回调函数作为参数的单参函数

```js
//正常版本的 readFile
fs.readFile(fileName, callback);

var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);
```

经过转换器处理, 变成了一个单参数函数, 只接受回调函数作为参数, 这个单参数版本, 就叫做 Thunk 函数

简单的 Thunk 函数转换器

```js
// ES5 版本
var Thunk = function (fn) {
  return function () {
    let arr = Array.prototype.slice(arguments);
    return function (callback) {
      arr.push(callback);
      return fn.apply(this, arr);
    };
  };
};

// ES6 版本
let Thunk = function (fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    };
  };
};
```

### Thunkify 模块

生产环境的转换器, 建议使用 Thunkify 模块

首先安装 `npm install thunkify`

使用方法:

```js
var thunkify = require("thunkify");
var fs = require("fs");

var read = thunkify(fs.readFile);
read("package.json")(function (err, str) {
  // xxx
});
```

Thunkify 的源码

```js
function thunkify(fn) {
  return function () {
    var args = new Array(arguments.length);
    var ctx = this;

    for (let i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return function (done) {
      var called;
      args.push(function () {
        if (called) return;
        called = false;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    };
  };
}
```

这个源码主要多了一个检查机制, 变量 called 确保回调函数只运行一次

```js
function f(a, b, callback) {
  var sum = a + b;
  callback(sum);
  callback(sum);
}

var ft = thunkify(f);
var print = console.log.bind(console); // 只是获取了 console.log 函数
ft(1, 2)(print);
```

### Generator 函数的流程管理

Thunk 函数可以用于 Generator 函数的自动流程管理

Thunk 函数包装一个异步函数放在 yield 关键字后面, 使用 yield 关键字交出执行权, 在 Generator 函数外面传入回调函数, 回调函数内部的 next 方法又将执行权交回 Generator 函数, 这样就可以将执行权在 Thunk 函数和 Generator 函数之间切换

这个执行权的交换过程是重复的, 可以使用**递归**

```js
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}
```

## co 模块

### 基本用法

```js
var co = require('co')
co(gen)
```

### co 模块的原理

Generator 就是一个异步操作的容器, 它的自动执行需要一种机制, 当异步操作有了结果, 能够自动交回执行权

有两种方法:
1. 回调函数, 将异步操作包装成 Thunk 函数, 在回调函数里面交回执行权
2. Promise 对象, 将异步操作包装成 Promise 对象, 使用 then 方法交回执行权

### 基于 Promise 对象的自动执行

```js
function run(gen) {
  var g = gen()

  function next(data) {
    var result = g.next(data)
    if(result.done) return result.value
    result.value.then(function(data) {
      next(data)
    })
  }

  next()
}

run(gen)
```

### co 模块的源码

### 处理并发的异步操作

co 支持并发的异步操作, 允许某些操作同时进行, 等到它们都完成, 进行下一步.

## 实例: 处理 Stream

Node 提供 Stream 模式读写数据,特点是一次只处理数据的一部分, 数据分成一块块依次处理.

Stream 模式使用 EventEmitterAPI, 会释放三个事件
- data 事件: 下一块数据块已经准备好了
- end 事件: 整个 '数据流' 处理完了
- error 事件: 发生错误

