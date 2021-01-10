const p1 = new Promise((resolve, reject) => {
  resolve('hello')
})
  .then((result) => {
    result
  })
  .catch((e) => {
    e
  })

const p2 = new Promise((resolve, reject) => {
  throw new Error('error')
})
  .then((result) => {
    result
  })
  .catch((e) => {
    e
  })

Promise.all([p1, p2])
  .then((result) => {
    console.log(result);
  })
  .catch((e) => {
    console.log(e);
  })
