let steps = [step1Func,step2Func,step3Func]

function* iterateSteps(steps) {
  for (let i = 0; i < steps.length; i++) {
    const element = steps[i];
    yield element
  }
}

let jobs = [job1, job2, job3]

function* iteratorJobs(jobs) {
  for (let i = 0; i < jobs.length; i++) {
    const element = jobs[i];
    yield* iterateSteps(job.steps)
  }
}