function f(m) {
  return m * 2
}

f(x + 5)

var thunk = function () {
  return x + 5
}

function f(thunk) {
  return thunk() * 2
}