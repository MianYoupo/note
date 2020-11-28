# ES语法学习

> http://es.xiecheng.live/
>
> 学习文档过程中的不完善笔记，感谢作者的贡献👏

## ES7

### Array.prototype.includes()

如果只想知道某个值是否在数组中存在，而并不关心它的索引位置，建议使用includes()。如果想获取一个值在数组中的位置，那么只能使用indexOf方法。

### 幂运算符 **

用来计算 幂

## ES8

### async / await

在async函数中使用await，那么await这里的代码就会变成同步的了，意思就是说只有等await后面的Promise执行完成得到结果才会继续下去

```js
// 把ajax封装成模块
import ajax from './ajax'

function request(url) {
    return new Promise(resolve => {
        ajax(url, res => {
            resolve(res)
        })
    })
}
//很像同步的写法
async function getData() {
    let res1 = await request('static/a.json')
    console.log(res1)
    let res2 = await request('static/b.json')
    console.log(res2)
    let res3 = await request('static/c.json')
    console.log(res3)
}
getData()
```

> 注意：await 只能在 async 标记的函数内部使用，单独使用会触发 Syntax error

### Object 扩展

#### Object.values()

Object.values() 返回一个数组，其元素是在对象上找到的可枚举属性值。属性的顺序与通过手动循环对象的属性值所给出的顺序相同(for...in，但是for...in还会遍历原型上的属性值)

#### Object.entries()

Object.entries()方法返回一个给定对象自身可枚举属性的键值对数组

#### Object.getOwnPropertyDescriptor

描述符

- value [属性的值]
- writable [属性的值是否可被改变]
- enumerable [属性的值是否可被枚举]
- configurable [描述符本身是否可被修改，属性是否可被删除]

### String 扩展

#### String.prototype.padStart()

把指定字符串填充到字符串头部，返回新字符串

#### String.prototype.padEnd()

把指定字符串填充到字符串尾部，返回新字符串

#### Trailing commas

函数尾参数，可以添加逗号

## ES9

### for await of 

异步迭代器(for-await-of)：循环等待每个Promise对象变为resolved状态才进入下一步

### RegExp

#### dotAll 模式

#### 具名组匹配

在正则表达式中，使用（）包裹起来的部分，称为**分组捕获**

```js
console.log('2020-05-01'.match(/(\d{4})-(\d{2})-(\d{2})/))
// ["2020-05-01", "2020", "05", "01", index: 0, input: "2020-05-01", groups: undefined]
```

1. index [匹配的结果的开始位置] 
2. input [搜索的字符串]
3. groups [一个捕获组数组 或 undefined（如果没有定义命名捕获组）]

```js
console.log('2020-05-01'.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/))
```

返回的 groups 是 Object 了

#### 后行断言

先行断言,?, world hello 就匹配不了

```js
let test = 'hello world'
console.log(test.match(/hello(?=\sworld)/))
```

后行断言，?<

```js
let test = 'world hello'
console.log(test.match(/(?<=world\s)hello/))
```

### Object Rest & Spread

展开 Object

```js
const input = {
  a: 1,
  b: 2
}

const output = {
  ...input,
  c: 3
}
```

接受多余参数

```js
const input = {
  a: 1,
  b: 2,
  c: 3
}

let { a, ...rest } = input
```

### Promise.prototype.finally()

Promise.prototype.finally() 方法返回一个Promise，在promise执行结束时，无论结果是fulfilled或者是rejected，在执行then()和catch()后，都会执行finally指定的回调函数

```js
new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('success')
        // reject('fail')
    }, 1000)
}).then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
}).finally(() => {
    console.log('finally')
})
```

### String

放松对标签模板里字符串转义的限制, 遇到不合法的字符串转义返回undefined，并且从raw上可获取原字符串

## ES10

### Object.fromEntries()

将键值对列表转换为对象，与 Object.entries() 相反

```js
Object.fromEntries([
    ['foo', 1],
    ['bar', 2]
])
```

1. 案例一：Object 转换

```js
const obj = {
    name: 'imooc',
    course: 'es'
}
const entries = Object.entries(obj)
console.log(entries)
// [Array(2), Array(2)]

// ES10
const fromEntries = Object.fromEntries(entries)
console.log(fromEntries)
// {name: "imooc", course: "es"}
```

2. 案例二： Map 转换 Object

```js
const map = new Map()
map.set('name', 'imooc')
map.set('course', 'es')
console.log(map)

const obj = Object.fromEntries(map)
console.log(obj)
// {name: "imooc", course: "es"}
```

3. 案例三： 过滤

```js
const course = {
    math: 80,
    english: 85,
    chinese: 90
}
const res = Object.entries(course).filter(([key, val]) => val > 80)
console.log(res)
console.log(Object.fromEntries(res))
```

### String 扩展

String.prototype.trimStart()

移除开头空格

String.prototype.trimEnd()

移除尾部空格

### Array 扩展

Array.prototype.flat()

数组扁平化，默认值为 1 

```js
const numbers = [1, 2, [3, 4, [5, 6]]]
console.log(numbers.flat())
// [1, 2, 3, 4, [5, 6]]
```

Array.prototype.flatMap()

flatMap() 方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。从方法的名字上也可以看出来它包含两部分功能一个是 map，一个是 flat（深度为1)

### 修订 Function.prototype.toString()

将返回注释、空格和语法详细信息

### 可选的 Catch Binding

原有的 catch 必须添加 err 参数，现在可以省略了

```js
try {
    // tryCode
} catch (err) {
    // catchCode
}

try {
    console.log('Foobar')
} catch {
    console.error('Bar')
}
```
### JSON 扩展

#### JSON superset

JSON 超集

#### JSON.stringify() 增强能力

### Symbol 扩展

Symbol.prototype.description

获取 Symbol 的描述符

## ES11

### String 扩展

String.prototype.matchAll()

### Dynamic import()

按需加载，将 import 放在回调之中

### BigInt

BigInt，表示一个任意精度的整数，可以表示超长数据，可以超出2的53次方

使用方式：

1. 数字后加n

```js
const bigInt = 9007199254740993n
```

2. 使用 BigInt 函数

```js
const bigIntNum = BigInt(9007199254740993n)
```

### Promise.allSettled()

Promise.all() 的问题是，有一个请求 rejected，那么整个都会 rejected

allSettled() 会返回所有 Promise 的状态

### globalThis

用来指定全局对象，无论在 web 和 node 环境下

### Optional chaining 可选链

可选链

```js
const user = {
    address: {
        street: 'xx街道',
        getNum() {
            return '80号'
        }
    }
}

const street2 = user?.address?.street
const num2 = user?.address?.getNum?.()
//注意这里的函数调用
```

可选链中的 ? 表示如果问号左边表达式有值, 就会继续查询问号后面的字段

### Nullish coalescing Operator 空值合并运算符

空值合并运算符（??）是一个逻辑运算符。当左侧操作数为 null 或 undefined 时，其返回右侧的操作数。否则返回左侧的操作数

```js
// false 0  无效
const a = b ?? 123
console.log(a)
```