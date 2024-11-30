// 3.2 Ticker: Write a function that accepts a number and a callback as the arguments. The function will return an EventEmitter that emits an event called tick every 50 milliseconds until the number of milliseconds is passed from the invocation of the function. The function will also call the callback when the number of milliseconds has passed, providing, as the result, the total count of tick events emitted. Hint: you can use setTimeout() to schedule another setTimeout() recursively.
import { EventEmitter } from "events"

// 3.2
// function tickCounter(number, callback) {
//   const eventEmitter = new EventEmitter()
//   let totalTicksEmmited = 0

//   const interval = setInterval(() => {
//     totalTicksEmmited++
//     eventEmitter.emit("tick", `number ${totalTicksEmmited}`)
//   }, 50)

//   setTimeout(() => {
//     clearInterval(interval)
//     callback(totalTicksEmmited)
//   }, number)

//   return eventEmitter
// }
// tickCounter(500, (data) =>
//   console.log(`in total, ${data} ticks were emitted`)
// ).on("tick", (number) => console.log(`tick number ${number}`))

// // 3.3 A simple modification: Modify the function created in exercise  so that it emits a tick event immediately after the function is invoked.
// function tickCounter(number, callback) {
//   const eventEmitter = new EventEmitter()
//   let totalTicksEmmited = 0

//   totalTicksEmmited++
//   setImmediate(() => eventEmitter.emit("tick", `number ${totalTicksEmmited}`))
//   // WITHOUT setImmediate, the first tick is not logged because the listener is not setted yet.

//   const interval = setInterval(() => {
//     totalTicksEmmited++
//     eventEmitter.emit("tick", `number ${totalTicksEmmited}`)
//   }, 50)

//   setTimeout(() => {
//     clearInterval(interval)
//     callback(totalTicksEmmited)
//   }, number)

//   return eventEmitter
// }

// tickCounter(500, (data) =>
//   console.log(`in total, ${data} ticks were emitted`)
// ).on("tick", (number) => console.log(`tick number ${number}`))
// ============================================
// ============================================
// ============================================
// 3.4 Playing with errors: Modify the function created in exercise 3.3 so that it produces an error if the timestamp at the moment of a tick (including the initial one that we added as part of exercise 3.3) is divisible by 5.
// Propagate the error using both the callback and the event emitter.
// Hint: use Date.now() to get the timestamp and the remainder (%) operator to check whether the timestamp is divisible by 5.
function tickCounter(number, callback) {
  const eventEmitter = new EventEmitter()
  let totalTicksEmmited = 0

  const checkTimestampAndEmit = () => {
    const timestamp = Date.now()

    if (timestamp % 5 === 0) {
      const error = new Error("Timestamp divisible by 5")

      eventEmitter.emit("error", error)
      clearInterval(interval)
      callback(error)
      return
    }
    totalTicksEmmited++
    eventEmitter.emit("tick", totalTicksEmmited)
  }

  setImmediate(() => checkTimestampAndEmit())

  const interval = setInterval(() => {
    checkTimestampAndEmit()
  }, 1000)

  setTimeout(() => {
    clearInterval(interval)
    callback(null, totalTicksEmmited)
  }, number)

  return eventEmitter
}

tickCounter(5000, (err, data) => {
  if (err) {
    console.log(`error found: ${err}`)
    return
  }
  console.log(`in total, ${data} ticks were emitted`)
})
  .on("tick", (number) => {
    console.log(`tick number ${number}`)
  })
  .on("error", (err) => console.error(`cached error: ${err}`))

// setInterval: "Ring the bell every 50ms until I tell you to stop"

// recursive setTimeout: "Ring the bell and if we're not done, ask someone to ring it again in 50ms"

// function tickCounter(number, callback) {
//   const eventEmitter = new EventEmitter()
//   let totalTicksEmitted = 0
//   let startTime = Date.now()

//   function tick() {
//     // Emit a tick
//     totalTicksEmitted++
//     eventEmitter.emit("tick", `number ${totalTicksEmitted}`)

//     // Check if we should continue
//     if (Date.now() - startTime < number) {
//       // Schedule next tick
//       setTimeout(tick, 50)
//     } else {
//       // Time's up, call the callback
//       callback(totalTicksEmitted)
//     }
//   }

//   // Start the first tick
//   setTimeout(tick, 50)
//   return eventEmitter
// }
