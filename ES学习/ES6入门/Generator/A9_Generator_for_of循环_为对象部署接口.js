function* objEntries(obj) {
	let propKeys = Reflect.ownKeys(obj)
	for(let propKey of propKeys) {
		yield [propKey, obj[propKey]]
	}
}

let jane = {
	first:'jane',
	second:'Doe'
}

for(let [key,value] of objEntries(jane)){
	console.log(`${key}  ${value}`)
}