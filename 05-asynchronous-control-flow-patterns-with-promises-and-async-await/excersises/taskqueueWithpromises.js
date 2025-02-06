// •5.2 TaskQueue with promises: Migrate the TaskQueue class internals from
// promises to async/await where possible. Hint: you won't be able to use
// async/await everywhere.

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
