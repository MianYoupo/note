const resolved = Promise.resolve(42)
const rejected = Promise.reject(1)

const allSettledPromise = Promise.allSettled([resolved, rejected])

allSettledPromise.then((result) => {
  console.log(result);
})
/* 
[
  { status: 'fulfilled', value: 42 },
  { status: 'rejected', reason: 1 }
]
 */