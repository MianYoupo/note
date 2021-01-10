function* entries(obj) {
  for(let key of Object.keys(obj)){
    yield {key,obj[key]}
  }
}

for(let [key,value] of entries(obj)){
  console.log(key, '->', value)
}