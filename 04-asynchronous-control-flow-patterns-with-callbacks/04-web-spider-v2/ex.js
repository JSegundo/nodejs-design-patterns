// We could also choose to generalize the solution even further by wrapping it in
// a function with a signature such as the following:

// iterateSeries(collection, iteratorCallback, finalCallback)

// Here, collection is the actual dataset you want to iterate over, iteratorCallback is
// the function to execute over every item, and finalCallback is the function that gets
// executed when all the items are processed or in case of an error. The implementation
// of this helper function is left to you as an exercise.

// The Sequential Iterator pattern
// Execute a list of tasks in sequence by creating a function
// named iterator, which invokes the next available task in the
// collection and makes sure to invoke

function iteratorSeries(collection, iteratorCallback, finalCallback) {
  const results = []
  console.log("Starting iteratorSeries")

  function iterator(index) {
    console.log(`Starting iteration for index: ${index}`)

    if (index === collection.length) {
      console.log("Reached end of collection")
      return finalCallback(null, results) //
    }

    console.log(`Processing item: ${collection[index]}`)
    iteratorCallback(collection[index], (err) => {
      console.log(`Callback received for index ${index}`)
      if (err) {
        console.log(`Error found at index ${index}:`, err)
        return finalCallback(err)
      }
      console.log(`Moving to next index: ${index + 1}`)
      iterator(index + 1)
    })
  }
  iterator(0)
}

const collection = [1, 2, 3, 4, 5]

function iteratorCallback(item, cb) {
  console.log(`Setting immediate for item: ${item}`)
  return setImmediate(() => {
    try {
      console.log(`Processing: ${item} * "2" = ${item * "2"}`)
      cb()
    } catch (err) {
      console.log(`Error in iteratorCallback: ${err}`)
      cb(err) // Notice this change - we're passing the error to the callback
    }
  })
}

console.log("Starting program")
iteratorSeries(collection, iteratorCallback, (err) => {
  if (err) {
    return console.error(`Error in iteratorSeries: ${err}`)
  }
  console.log(`Items processing finished`)
})
console.log("After iteratorSeries call")

// on the cmments you added before, let me know WHERE the error will propagate to. to have a clearer  image.
