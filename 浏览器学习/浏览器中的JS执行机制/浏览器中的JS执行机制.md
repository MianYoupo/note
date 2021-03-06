# 浏览器中的 js 执行机制

## 变量提升: js 代码是按顺序执行的吗?

### js 代码的执行流程

一段代码，经过编译后，会分成两个部分：执行上下文和可执行代码

<img src = "./1.png" width="70%">

执行上下文是 js 执行一段代码的运行环境

在执行上下文中存在一个变量环境的对象，对象中包含变量提升的内容

## 调用栈：为什么JavaScript代码会出现栈溢出

## 块级作用域：var缺陷以及为什么要引入let和const

块级作用域是通过词法环境的栈结构来实现的

var 声明的变量会存在于执行上下文中的**变量环境**中，let const 声明的变量会存在于执行上下文中的**词法环境**中。这两个环境都是栈结构

let const 生命的变量拥有块级作用域

执行过程中的变量查找遵循首先查找**词法环境**然后查找**变量环境**这个顺序

## 作用域链和闭包：代码中出现相同的变量，JavaScript引擎如何选择

函数中的变量查找是遵循词法作用域链的，词法作用域链在代码写好时候就决定了的

```js
function bar() {
    var myName = "极客世界"
    let test1 = 100
    if (1) {
        let myName = "Chrome浏览器"
        console.log(test)
    }
}
function foo() {
    var myName = "极客邦"
    let test = 2
    {
        let test = 3
        bar()
    }
}
var myName = "极客时间"
let myAge = 10
let test = 1
foo()
```

查找顺序

<img src = "./2.png" width = "70%">

闭包不会保存所有的变量，只会保存上级函数被下级函数引用的变量

### 闭包的回收

如果引用闭包的函数是一个全局变量，闭包会一直存在，直到页面关闭

如果引用闭包的函数是一个局部变量，闭包会被垃圾回收机制回收

## this：从JavaScript执行上下文视角讲this

在对象内部使用对象内部的属性，但是 js 的作用域链不支持，所以 js 引入 this 机制

