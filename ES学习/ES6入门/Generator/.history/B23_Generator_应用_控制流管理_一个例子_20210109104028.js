let steps = [1,2,3]

function* iterateSteps(steps) {
  for (let i = 0; i < steps.length; i++) {
    const element = steps[i];
    yield element
  }
}

for (const iterator of iterateSteps(steps)) {
  console.log(iterator)
}