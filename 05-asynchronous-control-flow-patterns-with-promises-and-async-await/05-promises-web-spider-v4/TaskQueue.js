export class TaskQueue {
  constructor (concurrency) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }

  runTask (task) {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {// 2. TaskQueue creates a wrapper (special envelope) around it:
        return task() // Your original package
        .then(resolve, reject)  // "Delivery confirmation" stamp
      })
      process.nextTick(this.next.bind(this))
    })
  }

  next () {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      task().finally(() => {
        this.running--
        this.next()
      })
      this.running++
    }
  }
}

// What's in this.queue looks like:
[
    () => {
        return readFileTask().then(resolve1, reject1)
    },
    () => {
        return readFileTask().then(resolve2, reject2)
    },
    // etc...
]

// When next() runs:
// next() {
//     while (this.running < this.concurrency && this.queue.length) {
//         const wrapper = this.queue.shift()  // Get wrapper function
        
//         wrapper()  // Run it
//             .finally(() => {
//                 this.running--    // Task done
//                 this.next()      // Try run more
//             })
            
//         this.running++
//     }
// }

// The key is that we're not just pushing tasks directly into the queue - we're pushing wrapper functions that know how to connect the task's result back to the promise returned by runTask()

// ej:
// When you use runTask(), it's like:

// You're giving the post office (TaskQueue) a package to deliver (your task)
// The post office gives you a tracking number (the Promise that runTask returns)
// The post office wraps your package in their special envelope (the wrapper function) that:

// Has your tracking number on it
// Knows to update your tracking status when delivered

// When you do:
// runTask(() => fetchSomething())

// // It's like:
// return new Promise((resolve, reject) => {           // Gives you tracking number
//     this.queue.push(() => {                        // Special envelope
//         return fetchSomething()                    // Your package
//             .then(resolve, reject)                 // Updates tracking status
//     })
// })

// The wrapper is important because it connects the original task's result back to your tracking number (the Promise you're waiting on). Without it, you'd get the package delivered but your tracking number would never update!
