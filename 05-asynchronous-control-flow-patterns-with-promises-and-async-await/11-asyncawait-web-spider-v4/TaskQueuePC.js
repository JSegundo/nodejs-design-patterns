export class TaskQueuePC {
  constructor (concurrency) {
    this.taskQueue = []// Stores taskWrapper functions
    this.consumerQueue = []// Stores resolve functions

    // spawn consumers
    for (let i = 0; i < concurrency; i++) {
      this.consumer()
    }
  }

  async consumer () {
    while (true) {
      try {
        const task = await this.getNextTask()
        await task()
      } catch (err) {
        console.error(err)
      }
    }
  }

  getNextTask () {
    return new Promise((resolve) => {
      if (this.taskQueue.length !== 0) {
        return resolve(this.taskQueue.shift())
      }

      this.consumerQueue.push(resolve)
    })
  }

  runTask (task) {
    return new Promise((resolve, reject) => {
      const taskWrapper = () => {
        const taskPromise = task()
        taskPromise.then(resolve, reject)
        return taskPromise
      }

      if (this.consumerQueue.length !== 0) {
        // there is a sleeping consumer available, use it to run our task
        const consumer = this.consumerQueue.shift()
        consumer(taskWrapper)
      } else {
        // all consumers are busy, enqueue the task
        this.taskQueue.push(taskWrapper)
      }
    })
  }
}

// demo
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class TaskQueueDemo {
  constructor(concurrency) {
    this.taskQueue = [] // Stores taskWrapper functions
    this.consumerQueue = []
    this.activeConsumers = 0

    console.log('Initial queues:', {
      taskQueue: this.taskQueue,
      consumerQueue: this.consumerQueue
    })
    // Start consumers
    for (let i = 0; i < concurrency; i++) {
      this.consumer(`Consumer ${i+1}`)
    }
  }

  async consumer(name) {
    console.log(`${name} starting up...`)
    
    while (true) {
      console.log(`${name} waiting for task...`)
      const task = await this.getNextTask()
      
      console.log(`${name} got a task, executing...`)
      this.activeConsumers++
      await task()
      this.activeConsumers--
      
      console.log(`${name} finished task. Active consumers: ${this.activeConsumers}`)
    }
  }

  async getNextTask() {
    return new Promise(resolve => {
      if (this.taskQueue.length > 0) {
        resolve(this.taskQueue.shift())
      } else {
        console.log('Storing resolve in consumerQueue:', resolve)
        console.log('resolve function looks like:', resolve.toString())
        this.consumerQueue.push(resolve)
      }
    })
  }

  runTask(task) {
    return new Promise((resolve, reject) => {
      const taskWrapper = () => {
        console.log('TaskWrapper contents:', taskWrapper.toString())
        // console.log('Running task...')
        return task().then(resolve, reject)
      }

      if (this.consumerQueue.length > 0) {
        const consumer = this.consumerQueue.shift()
        consumer(taskWrapper)  // Calling resolve(taskWrapper)
      } else {
        console.log('Storing taskWrapper in taskQueue:', taskWrapper)
      console.log('taskWrapper function looks like:', taskWrapper.toString())
        this.taskQueue.push(taskWrapper)
      }
    })
  }
}

// Let's try it out:
async function demo() {
  const queue = new TaskQueueDemo(2)  // 2 concurrent consumers
  
  // Create some tasks that take different times
  await delay(1000)  // Let consumers start up
  
  console.log('\nAdding Task 1 (takes 2s)')
  queue.runTask(() => delay(2000))
  
  console.log('Adding Task 2 (takes 1s)')
  queue.runTask(() => delay(1000))
  
  console.log('Adding Task 3 (takes 3s)')
  queue.runTask(() => delay(3000))
}

demo()

// consumerQueue is like a list of waiting customers' phone numbers - when a task is ready, we "call back" one of these numbers (resolve functions)
// taskQueue is like a list of wrapped packages ready to be delivered - each package (taskWrapper) contains both the task and instructions on how to report its completion (resolve/reject)