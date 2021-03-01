# async 函数

## 基本用法

延迟函数, 可以是执行延迟一段时间

```js
function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}

async function asyncPrint(value, ms) {
  await timeout(ms)
  console.log(value)
}

asyncPrint('hello world',5000)
```

## 语法

### 返回 Promise 对象

async 函数内部 return 语句返回的值, 会成为 then 方法回调函数的参数

### Promise 对象的状态变化

async 函数返回的 Promise 对象, 必须等到内部所有 await 命令后面的 Promise 对象执行完, 才会发生状态改变.

也就是, 只有 async 函数内部的异步操作执行完, 才会执行 then 方法指定的回调函数

```js
async function getTitle(url) {
  let response = await fetch(url)
  let html = await response.text()
  return html.match(/<title>([\s\S]+)<\/title>/i)[i]
}
getTitle('https://tc39.github.io/ecma262/').then(console.log)
```

await 命令

await 命令后面是一个 Promise 对象, 返回该对象的结果. 如果不是 Promise 对象, 直接返回对应的值

await 命令后面是一个 thenable 对象(定义了 then 方法的对象), await 也会将其等同于 Promise 对象

```js
class Sleep {
  constructor(timeout) {
    this.timeout = timeout
  }
  then(resolve, reject) {
    const startTime = Date.now()
    setTimeout(() => {
      resolve(Date.now() - startTime)
    }, this.timeout);
  }
}

(async () => {
  const sleepTime = await new Sleep(1000)
  console.log(sleepTime)
})()
```

简化休眠实现

```js
function sleep(interval) {
  return new Promise(resolve => {
    setTimeout(resolve, interval)
  })
}

async function one2FiveInAsync() {
  for (let i = 0; i <= 5 ; i++) {
    console.log(i)
    await sleep(1000)
  }
}

one2FiveInAsync()
```

await 命令后面的 Promise 对象如果变为 reject 状态, 参数可以被 catch 方法的回调函数接收到

```js
async function f() {
  await Promise.reject('error')
}

f()
.then( v => console.log(v))
.catch(e => console.log(e))
```

await 后面的 Promise 对象变为 reject 状态, 整个 async 函数**终止执行**

前一个异步操作失败也不中断后面操作, 可以将前一个 await 放在 try...catch 结构里面

```js
async function f() {
  try {
    await Promise.reject('error')
  } catch (e) {}
  return await Promise.resolve('hello world')
}

f()
.then( result => console.log(result))
```

await 后面的 Promise 对象在跟一个 catch 方法, 也可以阻止程序的终端

### 错误处理

await 后面的异步操作出错, 等同于 async 函数返回的 Promise 对象被 reject

防止出错的方法, 是将代码放在 try...catch 代码块中

如果有多个 await 命令, 可以统一放在 try...catch 结构中

```js
async function main() {
  try {
    const val1 = await firstStep()
    const val2 = await secondStep(val1)
    const val3 = await thirdStep(val1, val2)
  } catch(err) {
    console.log(err)
  }
}
```

实现多次重复尝试

```js
const supteragent = require('supteragent')
const NUM_RETRIES = 3

async function() {
  for(var i = 1; i <= NUM_RETRIES; i++){
    try {
      await supteragent.get('http://www.baidu.com')
      break
    } catch(err) {
      console.log(err) //尝试失败打印错误
    }
    console.log(i) //打印尝试次数
  }
}
```

上面的代码, 如果 await 尝试成功, 使用 break 退出循环, 如果失败会被 catch 语句捕捉, 进入下一轮循环

### 使用注意点

1. await 后面的 Promise 对象, 可能是 rejected, 最好把 await 命令放在 try...catch 代码块中
2. 如果多个 await 不存在**继发关系**, 最好同时触发

```js
//继发关系
//let foo = await getFoo()
//let bar = await getBar()

//非继发关系
// 写法一:
let fooPromise = getFoo()
let barPromise = getBar()
let foo = await fooPromise
let bar = await barPromise
// 写法二
let [foo, bar] = await Promise.all([getFoo(), getBar()])
```

3. await 命令只能用在 async 函数中, 如果用在普通函数, 会报错

确实希望多个请求并发执行, 且**都会 resolved 时**, 下面的写法等同

```js
async function dbFunc(db) {
  let docs = [{},{},{}]
  let promises = docs.map((doc)=>db.post(doc))

  let results = await Promise.all(promises)
  console.log(results)
}

//等同于

async function dbFunc(db) {
  let docs = [{}, {},{}]
  let Promises = docs.map((doc)=> db.post(doc))

  let results = []
  for(let promise of promises) {
    results.push(await promise) // resolved 才会继续执行, 否则一直等待
  }
  console.log(results)
}
```

4. async 函数可以保留运行堆栈

```js
//b 运行结束的时候, a 运行已经结束, b 的上下文会丢失
const a = () => {
  b().then(() => c())
}

//b 运行的时候, a 是暂停执行的, 保留上下文
const a = async () => {
  await b()
  c()
}
```

### async 函数的实现原理

async 函数的实现原理, 就是将 Generator 函数和自动执行器, 包装在一个函数里

```js
async function fn(args) {
  //...
}

//等同于
function fn(args) {
  return spawn(function*() {
    //...
  })
}
```

spawn 函数就是自动执行器, 下面是实现

```js
function spawn(genF) {
  return new Promise(function(resolve, reject){
    const gen = genF()
    function step( nextF ){
      let next
      try {
        next = nextF()
      } catch(err) {
        return reject(err)
      }
      if(next.done) {
        return resolve(next.value)
      }
      Promise.resolve(next.value).then(function(v){
        step(function(){ return gen.next(v)})
      }, function(e) {
        step(function() {return gen.throw(e)})
      })
    }
    step(function(){ return gen.next(undefined)})
  })
}
``` 

### 实例: 按顺序完成异步操作


