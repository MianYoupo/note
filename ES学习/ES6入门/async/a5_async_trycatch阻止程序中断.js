async function f() {
  try {
    await Promise.reject('error')
  } catch (e) {}
  return await Promise.resolve('hello world')
}

f()
.then( result => console.log(result))