function wrapper(generatorFunction) {
  let generatorFunctionFirstNext = generatorFunction()
  return generatorFunctionFirstNext.next()
}

function* generator(){
  console.log(`first input: ${yield}`)
  return 'DONE'
}

wrapper(generator).next('hello')
