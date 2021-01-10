function* fibonacci() {
	let [pre, cur] = [0,1];
	for(;;) {
		yield cur;
		[pre,cur] = [cur, pre + cur];
	}
}

for(let n of fibonacci()){
	if(n > 1000) break;
		console.log(n);
}