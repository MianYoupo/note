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