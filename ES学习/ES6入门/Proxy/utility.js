
function invariant(propKeys, action){
  if(propKeys[0] === '_') {
    throw new Error(`invalid attempt to ${action}`)
  }
}