const someAsyncThing = function() {
	return new Promise((resolve, reject) => {
		resolve(x + 2)
	});
}

someAsyncThing().then(function(){
	console.log('everything is great')
})

setTimeout(() => {
	console.log('123')
}, 2000);