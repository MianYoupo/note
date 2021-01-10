# Promise

## Promise 的含义

Promise, 里面保存着未来才会结束的事件

Promise 对象有以下两个特点:

1. 对象的状态不受外界影响, Promise 对象代表一个异步操作, 有三种状态: pending, fulfilled, rejected
2. 状态一旦改变就不会再变

Promise 的缺点:

1. 无法取消 Promise, 一旦新建就会立即执行, 无法中途取消
2. 内部抛出错误, 不会反映到外部
3. 处在 pending 状态时, 无法得知进展到哪一阶段

## 基本用法

```js
let promise = new Promise(function (resolve, reject) {
  console.log("Promise");
  resolve();
});

promise.then(function () {
  console.log("resolved");
});

console.log("hi");
//Promise
//hi
//resolved
```

当一个 Promise 执行完成后, 传递另一个 Promise 为参数, 那么后者的状态决定后续的操作

```js
const p1 = new Promise(function (resolve, reject) {
  //...
});

const p2 = new Promise(function (resolve, reject) {
  //...
  resolve(p1); // p1 的状态会决定 p2 的状态
});
```

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(function () {
    reject(new Error("fail"));
  }, 3000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(function () {
    resolve(p1);
  }, 1000);
});

p2.then((result) => console.log(result)).catch((error) => console.log(error)); // Error:fail
```

调用 resolve 和 reject 并不会终结 Promise 的函数的执行

```js
const p1 = new Promise(function (resolve, reject) {
  resolve(1);
  console.log(2);
}).then((r) => console.log(r));
/*
2
1
 */
```

一般调用 resolve 和 reject 后, Promise 的使命就完成了, 后续操作应该放在 then 方法里面, 不应该直接写在 resolve 或者 reject 后面, 最好在他们的前面加上 return 语句

```js
new Promise((resolve, reject) => {
  return resolve(1);
  // 后面的语句不会执行
  console.log(2);
});
```

## Promise.prototype.then()

Promise 实例具有 then 方法, then 方法是定义在原型对象的 Promise.prototype 上的

> then 方法返回的是一个新的 Promise 实例, 因此可以采用链式写法

## Promise.prototype.catch()

用于指定发生错误时的回调函数

Promise 内部的错误都会被 catch 捕获

Promise 状态已经变成 resolved, 再抛出错误是无效的

```js
const promise = new Promise((resolve, reject) => {
  resolve("ok");
  throw new Error("test");
});

promise
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.log(error);
  });
//ok
```

Promise 对象的错误具有'冒泡'性质, 会一直向后传递, 直到捕获为止

> 推荐做法: 不要在 then 方法里面定义 reject 状态的回调函数, 应该优先使用 catch 方法

跟传统的 try/catch 代码块不同的是, 如果没有使用 catch 方法指定错误处理函数, Promise 对象抛出的错误不会传递到外层代码, **不会有任何反应**

```js
const someAsyncThing = function () {
  return new Promise((resolve, reject) => {
    resolve(x + 2);
  });
};

someAsyncThing().then(function () {
  console.log("everything is great");
});

setTimeout(() => {
  console.log("123");
}, 2000);
// Uncaugh ReferenceError
// 123
```

Promise 内部的错误不会影响到 Promise 外部的代码

## Promise.ptototype.finally()

finally() 不管 Promise 对象最后状态如何, 都会执行操作

```js
promise
.then(result => {...})
.catch(error => {...})
.finally(()  => {...})
```

finally 方法的回调函数不接受任何参数, 没有办法知道, 前面的 Promise 状态到底是 fulfilled 还是 rejected

finally 方法里面的操作, **应该是与状态无关的**

```js
Promise.prototype.finally = function (callback) {
  let P = this.consructor;
  return this.then(
    (value) => P.resolve(callback()).then(() => value),
    (reason) =>
      P.resolve(callback()).then(() => {
        throw reason;
      })
  );
};
```

## Promise.all()

Promise.all() 方法用于将多个 Promise 实例, 包装成一个新的 Promise 实例

Promise.all() 方法的参数可以不是数组, 必须具有 Iterator 接口, 返回的每个成员**必须都是** Promise 实例

`const p = Promise.all([p1, p2, p3])`

p 的状态由 p1 p2 p3 决定, 分为两种情况:

1. 只有 p1 p2 p3 的状态都变为 fulfilled, p 的状态才会变成 fulfilled, 此时 p1 p2 p3 的返回值组成一个数组, 传递给 p 的回调函数
2. 只要 p1 p2 p3 之中有一个被 rejected, p 的状态就变成 rejected, 此时第一个被 reject 的实例的返回值, 会传递给 p 的回调函数

```js
// 生成一个 Promise 对象的数组
const promise = [2, 3, 4, 5, 6].map((id) => {
  return getJSON("/post/" + id + ".json");
});

Promise.all(promise)
  .then((posts) => {
    //...
  })
  .catch((reson) => {
    //...
  });
```

如果作为参数的 Promise 实例, 自己定义了 catch 方法, 它一旦被 rejected, 并不会触发 Promise.all() 的 catch 方法

```js
const p1 = new Promise((resolve, reject) => {
  resolve("hello");
})
  .then((result) => {
    result;
  })
  .catch((e) => {
    e;
  });

const p2 = new Promise((resolve, reject) => {
  throw new Error("error");
})
  .then((result) => {
    result;
  })
  .catch((e) => {
    e;
  });

Promise.all([p1, p2])
  .then((result) => {
    console.log(result);
  })
  .catch((e) => {
    console.log(e);
  });
```

## Promise.race()

Promise.race() 方法是将多个 Promise 实例, 包装成一个新的 Promise 实例

race 方法的参数与 all 方法一样, 如果不是 Promise 实例, 先调用 Promise.resolve() 方法

```js
// 5 秒内没有结果, p 的状态变为 rejected, 触发 catch 方法指定的回调函数
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('request timeout'))
    }, 5000);
  })
])

p.then(console.log(data)).catch(console.log(console.error(error));)
```

## Promise.allSettled()

Promise.allSettled() 方法接收一组 Promise 实例作为参数, 包装成为一个新的 Promise 实例, 所有参数返回结果, 包装实例才会返回结果

方法返回新的 Promise 实例, 状态总是 fulfilled, 不会变成 rejected

```js
const resolved = Promise.resolve(42);
const rejected = Promise.reject(1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then((result) => {
  console.log(result);
});
/* 
[
  { status: 'fulfilled', value: 42 },
  { status: 'rejected', reason: 1 }
]
 */
```

## Promise.any()

接收一组 Promise 实例作为参数, 包装成一个新的 Promise 实例返回

参数实例只要有一个变成 fulfilled 状态, 包装实例就会变成 fulfilled 状态, 所有参数实例都变成 rejected 状态, 包装实例就会变成 rejected 状态

```js
let resolved = Promise.resolve(42);
let rejected = Promise.reject(-1);
let alsoRejected = Promise.reject(Infinity);

Promise.any([resolved, rejected, alsoRejected]).then((result) => {
  console.log(result);
});

Promise.any([rejected, alsoRejected]).catch((result) => {
  console.log(result);
});
```

## Promise.resolve()

将现有对象转换为 Promise 对象

```js
Promise.resolve("foo");
// 等价于
new Promise((resolve) => resolve("foo"));
```

Promise.resolve() 方法的参数分成四种情况

1. 参数是一个 Promise 实例
2. 参数是一个具有 then 方法的对象

会将这个对象转换为 Promise 对象, 然后立即执行 then 方法

```js
let thenable = {
  then: funciton(resolve, reject) {
    resolve(42)
  }
}

let p1 = Promise.resolve(thenable)
p1.then(function(value) {
  console.log(value) //42
})
```

3. 参数不是具有 then 方法的对象, 或者不是对象

Promise.resolve() 方法返回一个新的 Promise 对象, 状态为 resolved

4. 没有参数

直接返回一个 resolved 状态的 Promise 对象

## Promise.reject

返回一个新的 Promise 实例, 实例状态为 rejected

```js
const p = Promise.reject("出错了");
//等同于
const p = new Promise((resolve, reject) => {
  reject("出错了");
});
//等同于
p.then(null, function (s) {
  console.log(s);
});
```

## 应用

### 加载图片

```js
const preloadImage = function (path) {
  return new Promise(function (resovle, reject) {
    const image = new Image();
    image.onload = resolve;
    image.onerror = reject;
    image.src = path;
  });
};
```

### Generator 函数与 Promise 的结合

```js
function getFoo() {
  return new Promise(function (resolve, reject) {
    resolve("foo");
  });
}

const g = function* () {
  try {
    const foo = yield getFoo();
    console.log(foo);
  } catch (e) {
    console.log(e);
  }
};

function run(generator) {
  const it = generator();

  function go(result) {
    if (result.done) return result.value;

    return result.value.then(
      function (value) {
        return go(it.next(value));
      },
      function (error) {
        return go(it.throw(error));
      }
    );
  }

  go(it.next());
}

run(g);
```

## Promise.try()

使用 Promise 包装的函数不论同步还是异步都会在事件轮询后执行, 这对于同步执行的函数不友好

```js
const f = () => console.log('now');
Promise.resolve().then(f);
console.log('next');
// next
// now
```

统一使用 promise.catch() 捕获所有同步和异步的错误

```js
Promise.try(() => database.users.get({id: userId}))
.then(...)
.catch(...)
```