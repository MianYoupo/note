function* gen(){

}

var g = gen()

console.log(g[Symbol.iterator]() === g);