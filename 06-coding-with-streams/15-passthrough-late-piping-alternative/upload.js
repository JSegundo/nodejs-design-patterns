import axios from 'axios'
import { PassThrough } from 'stream'

export function createUploadStream (filename) {
  const connector = new PassThrough()

  axios
    .post(
      'http://localhost:3000',
      connector,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Filename': filename
        }
      }
    )
    .catch((err) => {
      connector.emit(err)
    })

  return connector
}

// Creates a PassThrough stream that acts as a connector
// Starts the HTTP upload immediately but data flows later
// Returns the stream right away so you can pipe data to it
// The actual upload happens as data flows through the PassThrough

// It's like creating a pipe and hooking it up to the server before you actually start pouring water (data) through it.