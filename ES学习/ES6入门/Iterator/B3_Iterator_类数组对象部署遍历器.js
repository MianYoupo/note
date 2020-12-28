var iterator = {
  0:'a',
  1:'b',
  2:'c',
  length :3,
  [Symbol.iterator]:[][Symbol.iterator]
}

for(var i of iterator) {
  console.log(i);
}