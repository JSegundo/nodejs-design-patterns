function delay (milliseconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Date())
    }, milliseconds)
  })
}

async function playingWithDelays () {
  console.log('Delaying...', new Date())

  const dateAfterOneSecond = await delay(1000)
  console.log(dateAfterOneSecond)

  const dateAfterThreeSeconds = await delay(3000)
  console.log(dateAfterThreeSeconds)

  return 'done'
}

playingWithDelays()
  .then(result => {
    console.log(`After 4 seconds: ${result}`)
  })

//   The await expression works with any value, not just promises. If a
// value other than a Promise is provided, then its behavior is similar
// to awaiting a value that it first passed to Promise.resolve().

// These two lines do exactly the same thing:
// const x = await 42
// const x = await Promise.resolve(42)