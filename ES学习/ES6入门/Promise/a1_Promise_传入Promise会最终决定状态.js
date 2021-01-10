const p1 = new Promise(function (resolve, reject){
	resolve(1)
	console.log(2);
}).then (r => console.log(r))