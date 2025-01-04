export class TaskQueue {
  constructor (concurrency) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }

  pushTask (task) {
    this.queue.push(task)
    console.log('Tasks in queue:', this.queue.map(t => t.toString()))
    // Or even simpler, just the length
    console.log('Queue length:', this.queue.length)
    process.nextTick(this.next.bind(this))
    return this
  }

  next () {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      task(() => {
        this.running--
        process.nextTick(this.next.bind(this))
      })
      this.running++
    }
  }
}
