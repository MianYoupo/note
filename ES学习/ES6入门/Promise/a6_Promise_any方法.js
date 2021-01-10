let resolved = Promise.resolve(42)
let rejected = Promise.reject(-1)
let alsoRejected = Promise.reject(Infinity)

Promise.any([resolved, rejected,alsoRejected]).then((result) => {
 console.log(result); 
})

Promise.any([rejected,alsoRejected]).catch((result) => {
  console.log(result);
})