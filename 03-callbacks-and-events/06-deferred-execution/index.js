/* eslint handle-callback-err: 0 */
import { readFile } from "fs"

const cache = new Map()

function inconsistentRead(filename, cb) {
  if (cache.has(filename)) {
    // deferred execution
    setImmediate(() => cb(cache.get(filename)))
    // process.nextTick(() => cb(cache.get(filename)))
  } else {
    // asynchronous function
    readFile(filename, "utf8", (err, data) => {
      cache.set(filename, data)
      cb(data)
    })
  }
}

function createFileReader(filename) {
  // 1. Create an array to store callbacks
  const listeners = []
  // 2. Try to read the file
  inconsistentRead(filename, (value) => {
    // 3. When we get the value, call all stored callbacks
    listeners.forEach((listener) => listener(value))
  })

  // 4. Return an object with method to add new listeners
  return {
    onDataReady: (listener) => listeners.push(listener),
  }
}

const reader1 = createFileReader("data.txt") // Empty listeners array []
reader1.onDataReady((data) => {
  // Add listener to array
  console.log(`First call: ${data}`) // Will be called when file is read

  // Works because file read is async, giving us time to add listener

  // ...sometime later we try to read again from
  // the same file

  const reader2 = createFileReader("data.txt") // Empty listeners array []
  // ⚠️ Value is returned immediately because file is cached!
  // All listeners are called RIGHT NOW, but array is still empty!

  reader2.onDataReady((data) => {
    // Too late! Data was already processed
    console.log(`Second call: ${data}`) // Never gets called
  })
})

// A process.nextTick callback is added to process.nextTick queue. A Promise.then() callback is added to promises microtask queue. A setTimeout, setImmediate callback is added to macrotask queue.

// Event loop executes tasks in process.nextTick queue first, and then executes promises microtask queue, and then executes macrotask queue.
