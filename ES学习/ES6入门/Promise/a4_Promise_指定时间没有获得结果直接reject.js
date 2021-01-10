const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('request timeout'))
    }, 5000);
  })
])

p.then(console.log(data)).catch(console.log(console.error(error));)