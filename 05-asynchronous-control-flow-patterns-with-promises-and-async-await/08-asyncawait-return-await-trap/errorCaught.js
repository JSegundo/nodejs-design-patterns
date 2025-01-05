function delayError (milliseconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Error after ${milliseconds}ms`))
    }, milliseconds)
  })
}

async function errorCaught () {
  try {
    return await delayError(1000) // Awaiting the  promise ensures that the error is caught
  } catch (err) {
    console.error('Error caught by the async function: ' +
      err.message)
  }
}

errorCaught()
  .catch(err => console.error('Error caught by the caller: ' +
    err.message))
