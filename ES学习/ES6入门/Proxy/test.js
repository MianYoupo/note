function test1() {
  return Reflect.apply(...arguments) *2
}
function test2(){
  
}
console.log(test1(1,2,3));