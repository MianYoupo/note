# typescript

首先全局安装 ts 组件

```
npm install typescript -g
```

方便直接运行 ts 文件，还需要全局安装

```
npm install ts-node -g
```

## static typing 静态类型

被声明类型之后，就不能被改变。

```typescript
interface xiaojiejie {
  uname: string;
  age: number;
}
const xiaohong: xiaojiejie = {
  uname: "xiaohong",
  age: 12,
};
console.log(xiaohong.uname);
```

静态类型分为 基础静态类型 和 对象静态类型

函数类型的定义

```typescript
const dajiao : ()=> string = ()=>{  //这个表明，类型为函数，并且返回值必须为 string 类型
	return 'hahahah'
}
```

对象静态类型： 数组类型 对象类型 类类型 函数类型

type annotation 类型注解，ts 能够自动的推断出来类型

type inference 类型推断，ts 不能自动推断出来的类型，需要手动标注。

函数类型的注解

```typescript
function xiaojiejie (one:number,two:number):number {  //函数输出为 number 类型
  return one + two
}
```

void 返回为空

never 无法执行完

```typescript
function errorFunction():never {
 	throw new Error()  //只能执行到这里
 	console.log('hello world')
}

function forNever():never {
	while(true){}
  console.log('hello world')
}
```

当函数的参数是对象的时候，参数的注释

```typescript
function add({one,two} : {one:number,two:number}) {
	return one + two
}
```

数组类型的类型注解

```typescript
const numberArr : number[] = [1,2,3]
const stringArr : string[] = ['a','b','c']
const undefinedArr : underfined[] = [undefined,undefined]
const arr : (number | string)[] = [1,'string',2]

//这样为对象数组注解比较麻烦，可以使用类型别名 type alias
const xiaojiejie : {name: string,age:number}[] = [
  {name:'liuying',age:18},
  {name:'xiedajiao',age:28}
]

type lady = {name:string, age:number}  //type 关键字，修饰类型别名
const xiaojiejie : lady[] = [
  {name:'liuying',age:18},
  {name:'xiedajiao',age:28}
]
//类型别名使用，class 也可以使用
class madam {
  name:string;
  age:number
}
const xiaojiejie : madam[] = [
  {name:'liuying',age:18},
  {name:'xiedajiao',age:28}
]
```

元组的使用

元组用来解决，参数在类型注解不报错的顶框下，顺序的问题。

```typescript
const xiaojiejie : (string,number)[] = ['dajiao','teacher',28]
const xiaojiejie : (string,number)[] = ['dajiao',28,'teacher']
这个不会报错，但是逻辑上有问题
```

元组这样写

```typescript
const xiaojiejie : [string,string,number] = ['dajiao','teacher',28]
//这样也是元组。
const xiaojiejie : [string,string,number][] = [
  ['dajiao','teacher',28],
  ['dajiao','teacher',28],
  ['dajiao','teacher',28]
]

```

interface 接口的使用，注意这里可以使用可选属性 ?: ，也可以使用拓展属性[propname:string]:any

```typescript
interface Girl {  //这个就是接口
  name: string;
  age: number;
  bust: number;
  waistline ?: number;  //这个是可选项
  [propname:string] : any  //这个是拓展属性，属性名是 string，属性值可以为任何。
}

class xiaojiejie implements Girl {  //类 xiaojiejie 收到了 Girl 接口的约束
  name: "liuying";
  age: 18;
  bust: 21;
  say(){
    return '欢迎红浪漫洗浴'
  }
}

const screenResume = (girl: Girl) => {
  girl.age < 24 && girl.bust >= 90 && console.log(girl.name + "进入面试");
  (girl.age >= 24 || girl.bust < 90) && console.log(girl.name + "为进入面试");
};

const getResume = (girl: Girl) => {
  console.log(girl.name + "年龄是" + girl.age);
  console.log(girl.name + "胸围是" + girl.bust);
  girl.waistline && console.log(girl.name + '的腰围是' + girl.waistline);
  girl.sex && console.log(girl.name + '的性别是' + girl.sex);
};

const dajiao = {
  name: "dajiao",
  age: 21,
  bust: 91,
  waistline: 21,
  sex:'女'
};
screenResume(dajiao);
getResume(dajiao);

```

类的使用

```typescript
class Lady {
  content = 'hi awesome'
  sayHello(){
    return this.content
  }
}

class xiaojiejie extends Lady {
  sayHello(){  //方法重写，改写了父类的方法。
    return 'hi, honey'
  }
  sayLove(){
    return 'i love you'
  }
}
const godness = new xiaojiejie()
console.log(godness.sayHello())
console.log(godness.sayLove());
```

可以使用 super 关键字，拓展父类的方法。

```typescript
class Lady {
  content = 'hi awesome'
  sayHello(){
    return this.content
  }
}

class xiaojiejie extends Lady {
  sayHello(){
    return super.sayHello() + '你好'  //拓展了父类 Lady 中的方法
  }
  sayLove(){
    return 'i love you'
  }
}
```

内部类和外部类

```typescript
class Person {
  protected name : string;  //protected 可以被相关联的类访问到，private 只能被自己访问。这两个都不能被外部
  						    //访问到
  public sayHello(){
    console.log(this.name + ' say Hello');
  }
}

class Teacher extends Person {
  public sayBye(){
    console.log(this.name);
  }
}

const person = new Person()
person.name = 'jspang'
person.sayHello()
console.log(person.name);
```

类的构造函数

```typescript
class Person {
  constructor(public name:string){  //相当于同时声明了 public name: string
    this.name = name
  }
}
const person = new Person('jspang')
console.log(person.name);
```

构造函数的继承

```typescript
class Person {
  constructor(public name:string){
    this.name = name
  }
}

class Teacher extends Person {
  constructor(public age: number){
    super('jspang')  //使用了 spuer 关键字，对于继承的类，这个关键字必须写。
  }
}
const person = new Teacher(18)
console.log(person.age);
console.log(person.name);
```

getter 和 setter

```typescript
//getter 的使用方式
class xiaojiejie {
  constructor(private _age:number){}
  get age(){
    return this._age - 10  //这个时候返回的是 8，没有返回真实的数字18。
  }
}

const dajiao = new xiaojiejie(18)
console.log(dajiao.age);
```

静态类

```typescript
class Girl {
	static sayLove(){
		return 'i love you'
	}
}

console.log(Girl.sayLove())	// i love you 静态类不用实例化，直接使用方法。
```

抽象类

​	只读属性

```typescript
class Person {
    public readOnly _name:String  //readOnly 只读关键字
    constructor(name:String) {
        this._name = name
    }
}

const person = new Person('jspang')
console.log(person._name)
person._name = 'caixukun'  //会报错
```

```typescript
abstract class Girl {
	abstract skill()	//抽象方法不能有内容，用来限制类中必须包含的方法名称
}

//其余的类在继承抽象类的时候，必须实现相应的抽象方法。
class Waiter extends Girl {		//extends 继承关键字
    skill() {
        console.log('xxx')  //在继承类中必须实现抽象方法
    }
}
```

配置文件 .tsconfig

```
tsc -init
```

"include" : ["demo1.ts"]	//这个配置项定义被编译的 ts 文件，没有则不编译

"exclude" : ["demo2.ts"]	//规定不包含的文件

"removeComment"	//可以一处文件中的注释

"noImplicitAny"	//如果为 true，文件中的 any 注释类型不必写出来

"strictNullChecks"	//如果为 true, 文件中不允许出现 Null 值

"outDir"	//用来规定编译的输出目录 "outDir" : "./build"

"rootDir"	//用来规定编译 ts 的读取目录 "rootDir" : "./src"

"sourceMap"	//源文件与编译后文件的映射

"noUnusedLocals"	//会对文件中未使用的部分进行提示



联合类型和类型保护（类型守护）

```typescript
interface Waiter {
    anJiao: boolen;
    say()=>{}
}
interface Teacher {
    anJiao: boolean;
    skill()=>{}
}
function judgeWho(animal:Waiter | Teacher) {
    animal.say()	//会报错，因为可能为 Teacher 类型，没有 say 方法
}	//这里就要使用类型守护
```

类型断言是类型守护的一种

```typescript
//as 方法
function judgeWho(animal: Waiter | Teacher) {
    if(animal.anjiao) {
		(animal as Teacher).skill()	//是用 as 断言。
    } else {
        (animal as Waiter).say()
    }
}

//typeof 方法
function add(first: string | number, second: string | number) {
    if(typeof first === "string" || typeof second === "string") {
        return `$(first)$(second)`
    }
    return first + second;
}

//instanceof 方法
//注意：instanceof 方法的 target 必须为对象
function addObj(first:object | NumberObj, second:object | NumberObj) {
    if(first instanceof NumberObj && second instanceof NumberObj) {
        return first.count + second.count;
    }
    return 0;
}
```

枚举类型 enum

```typescript
enum Status {
	MASSAGE,
	SPA,
	DABAOJIAN
}	//美剧类型默认存在 index，从0开始
```

是用泛型

```typescript
function join<JSPang>(first:JSPang, second:JSPang){	//声明JSPang泛型，且输入参数必须为JSPang
    return `${first}${second}`
}
join<number>(1,2)	//join 中使用 number 类型，输入参数也得是 number
```

泛型中数组的使用

```typescript
function myFunc<ANY>(param: ANY[]){
  return param;
}
myFunc<string>(['123','456'])
```

泛型也可以有多个

```typescript
function join<T,P>(first:T,second:P){
	return `$(first)$(second)`
}
join<string,number>("1",2)
```

在类中是用泛型

```typescript
class SelectGirl<T>{
  constructor(private girl: T[]){}
  getGirl(index:number):T{
    return this.girls[index]
  }
}
const selectGirl = new SelectGirl<string>(['xx','xxx','xxxx'])
```

泛型不仅仅可以使用基本类型，也可以从 interface 继承

```typescript
interface Girls {
	name:string
}
class SelectGirl <T extends Girl>{
  constructor(private girls:T[]){}
  getGirl(index:number):string{
    return this.girls[index].name
  }
}
const selectGirl = new SelectGirl([
  {name:'xx'},
  {name:'xxx'},	//写成了 interface 的形式
  {name:'xxxx'}
])
```

泛型的约束

```typescript
class SelectGirls<T extends number | string>{}
//是用extends关键字
```

