### 基本概念

Generator 函数是一个状态机, 封装了多个内部状态

执行 Generator 函数会返回一个遍历器

Generator 函数的两个特征:

1. function 关键字与函数名之间有一个星号
2. 函数体内部使用 yield 表达式

### yield 表达式

Generator 函数可以不用 yield 表达式, 成为一个单纯的暂缓执行函数

```js
function* f() {
  console.log("called");
}

var generator = f();

setTimeout(() => {
  generator.next();
}, 2000);
```

> yield 表达式只能用在 Geneator 函数内, 用在普通函数内会报错

yield 表达式如果在另外的表达式中, 必须放在圆括号内

```js
function* demo() {
  console.log("called");
  console.log("hello\n" + (yield 456));
  console.log("hello\n" + (yield 123));
}

var generator = demo();
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
```

yield 表达式用作函数参数或放在赋值表达式的右边, 可以不加括号

```js
function* demo() {
  foo(yield "a", yield "b");
  let input = yield;
}
```

### 与 Iterator 接口的关系

Generator 函数就是遍历器生成函数, 可以把 Generator 赋值给对象的 Symbol.iterator 属性, 从而使对象有 Iterator 接口

```js
var myIterator = {};

myIterator[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

console.log([...myIterator]);
```

> Generator 函数执行后, 返回遍历器对象, 遍历器对象也有 Symbol.iterator 属性, 执行后返回的遍历器对象**就是自己**

```js
function* gen() {}

var g = gen();

console.log(g[Symbol.iterator]() === g);
```

### next 方法的参数

yield 表达式总是返回 underfined. next 方法可以带一个参数, 该参数皆被当做上一个 yield 表达式的返回值

```js
function* f() {
  for (var i = 0; true; i++) {
    var reset = yield i;
    if (reset) {
      i = -1;
    }
  }
}

var generator = f();
console.log(generator.next());
console.log(generator.next());
console.log(generator.next(true));
```

> 通过 next 方法的参数, 可以在 Generator 函数运行的不同阶段, 从外部像内部注入不同的值, 调整函数行为

如果想要在第一次调用 next 方法时, 能够输入值, 可以在 Generator 函数外面再包一层函数, 并且调用一次 Generator 状态

```js
function wrapper(generatorFunction) {
  let generatorFunctionFirstNext = generatorFunction();
  return generatorFunctionFirstNext.next();
}

function* generator() {
  console.log(`first input: ${yield}`);
  return "DONE";
}

wrapper(generator).next("hello");
```

### for...of 循环

for...of 循环可以自动遍历 Generator 函数运行时生成的 Iterator 对象, 不用使用 next 方法

```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6; //没有包含在 for..of 循环中
}

for (let v of foo()) {
  console.log(v);
}
```

斐波那契数列的例子

```js
function* fibonacci() {
  let [pre, cur] = [0, 1];
  for (;;) {
    yield cur;
    [pre, cur] = [cur, pre + cur];
  }
}

for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}
```

原生的 js 对象没有遍历接口, 通过 Generator 函数为对象加上接口, 就可以使用了

```js
function* objEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);
  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

let jane = {
  first: "jane",
  second: "Doe",
};

for (let [key, value] of objEntries(jane)) {
  console.log(`${key}  ${value}`);
}
```

除了 for...of 还有 拓展运算符(...) 解构赋值和 Array.from 方法内部调用的都是遍历器接口

### Generator.prototype.throw()

Generator 函数返回的遍历器对象, 有 throw 方法, 可以在函数体**外部**抛出错误, 在 Generator 函数体内捕获

```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log("内部捕获错误", e);
  }
};

var i = g();
i.next();

try {
  i.throw("a");
  i.throw("b");
} catch (e) {
  console.log("外部捕获", e);
}
```

可以使用 throw 抛出 Error 对象的实例

```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log(e);
  }
};

var i = g();
i.next();
i.throw(new Error("出错了"));
```

如果 Generator 函数内部和外部, 都没有部署 try...catch 代码块, 那么程序报错

throw 方法抛出的错误被内部捕获, 前提必须至少执行过一次 next 方法

throw 方法被捕获后, 会附带执行下一条 yield 表达式

```js
function* foo() {
  var x = yield 3;
  var y = x.toUpperCase();
  yield y;
}

var it = foo();
it.next();

try {
  it.next(42);
} catch (err) {
  console.log(err); //typeerror
}
```

### Generator.prototype.return()

Generator 函数返回的遍历器对象, 有 return() 方法, 可以返回给定的值, 并且终结 Generator 函数

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var gen = gen();

console.log(gen.next());
console.log(gen.return("foo")); // {value: 'foo', done: true}
console.log(gen.next());
```

如果 return 方法调用时, 不提供参数, 返回的 value 值为 undefined

如果 try...finally 代码块, 且正在执行 try 代码块, 那么 return 方法会导致立刻进入 finally 代码块, 执行完 finally 代码块, 会返回 return 方法指定的返回值

### next() throw() return() 的共同点

这三个方法的作用都是使 Generator 函数恢复执行, 并且使用不同的语句替换 yield 表达式

next() 是将 yield 表达式替换成一个值

throw() 事件 yield 表达式替换成一个 throw 语句

return 是将 yield 表达式替换成一个 return 语句

### yield\* 表达式

如果在 Generator 函数内部, 调用另一个 Generator 函数, 那么需要在前者的函数内部, 手动完成遍历

```js
function* foo() {
  yield "a";
  yield "b";
}

function* bar() {
  yield "x";
  for (let i of foo()) {
    console.log(i);
  }
  yield "y";
}

for (let v of bar()) {
  console.log(v);
}
/*
x
a
b
y
 */
```

ES6 提供了 yield\* 表达式, 用来在一个 Generator 函数内部执行另一个 Generator 函数

```js
function* bar() {
  yield "x";
  yield* foo();
  yield "y";
}

function* foo() {
  yield "a";
  yield "b";
}

for (let v of bar()) {
  console.log(v);
}
```

任何数据结构只要有 Iterator 接口, 就可以被 yield\* 遍历

## 作为对象属性的 Generator 函数

```js
//以下两种写法是等价的
let obj = {
  *myGeneratorMethod() {},
};

let obj = {
  myGeneratorMethod: function* () {},
};
```

## Generator 函数的 this

Generator 函数返回一个遍历器, 这个遍历器是 Generator 函数的实例, 继承 Generator 函数的 prototype 对象上的方法

```js
function* g() {}

g.prototype.hello = function () {
  return "hi";
};

let obj = g();

console.log(obj instanceof g);
console.log(obj.hello());
```

不能够把 Generator 函数当作普通的构造函数, 使用 new 关键字会报错

对 Generator 函数使用 call 方法, 可以使用 Generator 中的 this

```js
function* F() {
  this.a = 1;
  yield (this.b = 2);
  yield (this.c = 3);
}

var obj = {};
var f = F.call(obj);

f.next();
f.next();
f.next();

console.log(obj.a, obj.b, obj.c);
```

上面的代码执行的是遍历器对象 f, 生成的对象实例是 obj, 下面将这两个对象统一

将 obj 换为 F.prototope

```js
function* F() {
  this.a = 1;
  yield (this.b = 2);
  yield (this.c = 3);
}

var f = F.call(F.prototype);

f.next();
f.next();
f.next();

console.log(f.a);
Console.log(f.b);
console.log(f.c);
```

## 含义

### Generator 与状态机

Generator 是实现状态机的最佳结构

```js
var clock = function* () {
  while (true) {
    console.log("tick");
    yield;
    console.log("tock");
    yield;
  }
};
var get = clock();
get.next();
get.next();
get.next();
get.next();
```

### Generator 与协程

传统的**子例程**采取堆栈式的**后进先出**的执行方式, 只有当调用的子函数完全执行完毕, 才会结束执行父函数

协程与其不同, 多个线程 (单线程的情况下, 多个函数) 可以并行执行, 但是只有一个线程 (或者函数) 处在运行的状态, 其他线程 (或者函数) 处在**暂停态** (suspended), 线程 (函数) 之间可以交换执行权

> 一个线程 (函数) 执行到一半, 可以暂停执行, 将执行权交给另一个线程 (函数), 等到后来收回执行权的时候, 恢复执行. 这种可以并行执行, 交换执行权的线程 (函数), 就是协程

协程适合用于多任务运行的环境. 普通的线程是抢先式的, 那个线程优先得到资源, 由运行环境决定, 协程是合作式的, 执行权由协程自己分配

Generator 函数是 ES6 对协程的实现, 属于**不完全实现**, Generator 函数被称为**半协程** (semi-coroutin), 只有 Generator 函数的调用者, 才能将程序的执行权还给 Generator 函数. 完全实现的协程, 任何函数都可以让暂停的协程继续执行

### Generator 与上下文

Generator 函数执行产生的上下文环境, 一旦遇到 yield 命令, 就会暂时退出堆栈, 但是**不会消失**, 里面的所有变量和对象会冻结在当前状态. 等到对它执行 next 命令时, 这个上下文环境又会重新加入调用栈, 冻结的变量和对象恢复执行

```js
function* gen() {
  yield 1;
  return 2;
}

let g = gen();

console.log(g.next(), g.next());
```

## 应用

### 异步操作的同步化表达

Generator 函数的暂停执行的效果, 可以把异步操作写在 yield 表达式里面, 等到调用 next 方法时再往后执行

等同于不需要写回调函数了, 异步操作的后续操作可以放在 yield 表达式下面, 在异步操作用里面使用 next 方法, 就可以恢复执行了

Ajax 是典型的异步操作, 通过 Generator 函数部署 Ajax 操作, 可以使用同步的方式表达

```js
function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
  console.log(resp.value);
}

function request(url) {
  makeAjaxCall(url, function (response) {
    comment;
    it.next(response);
  });
}

var it = main();
it.next();
```

### 控制流管理

下面的做法只能用于所有步骤都是同步操作的情况,

```js
let steps = [step1Func, step2Func, step3Func];

function* iterateSteps(steps) {
  for (let i = 0; i < steps.length; i++) {
    const element = steps[i];
    yield element;
  }
}

let jobs = [job1, job2, job3];

function* iteratorJobs(jobs) {
  for (let i = 0; i < jobs.length; i++) {
    const element = jobs[i];
    yield* iterateSteps(job.steps);
  }
}
```

### 部署 Iterator 接口

```js
function* iterEntries(obj) {
  let keys = Objext.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myobj)) {
  console.log(key, value);
}
```

### 作为数据结构

Generator 可以看作是数组结构