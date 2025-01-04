function makeSampleTask(name) {
  return (cb) => {
    console.log(`${name} started (Running tasks: ${running})`)
    setTimeout(() => {
      console.log(`${name} completed (Completed tasks: ${completed + 1})`)
      cb()
    }, Math.random() * 2000)
  }
}

const tasks = [
  makeSampleTask('Task 1'),
  makeSampleTask('Task 2'),
  makeSampleTask('Task 3'),
  makeSampleTask('Task 4'),
  // makeSampleTask('Task 5'),
  // makeSampleTask('Task 6'),
  // makeSampleTask('Task 7')
]

const concurrency = 2
let running = 0
let completed = 0
let index = 0

function next() {
  console.log(`\nEntering next(): running=${running}, index=${index}`)

  while (running < concurrency && index < tasks.length) {
    const task = tasks[index++] // gets current index value, then increments
    // same as doing
    // const task = tasks[index]  
    // index = index + 1  
    console.log(`Starting task at index ${index-1}`) 
    task(() => {
      if (++completed === tasks.length) {
        return finish()
      }
      running--
      next()
    })
    running++
    console.log(`After starting task, running is now: ${running}`)  // Now we'll see it reach 2!
}
  // Log why we exited the loop
  if (running >= concurrency) {
    console.log(`Loop exited: Reached concurrency limit (running=${running})`)
  }
  if (index >= tasks.length) {
    console.log(`Loop exited: No more tasks (index=${index})`)
  }
  console.log(`=== Exiting next() ===\n`)
}

next()

function finish() {
  console.log('All tasks completed!')
}