var arr = [3,4,5]
arr.foo = 'hello'

for(var i in arr) {
  console.log(i);
}

for(var i of arr) {
  console.log(i);
}