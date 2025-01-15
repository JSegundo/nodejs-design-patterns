import { PassThrough } from 'stream'

let bytesWritten = 0
const monitor = new PassThrough()
monitor.on('data', (chunk) => {
  bytesWritten += chunk.length
})
monitor.on('finish', () => {
  console.log(`${bytesWritten} bytes written`)
})

monitor.write('Hello!')
monitor.end()

// PassThrough. This type of
// stream is a special type of Transform that outputs every data chunk without applying
// any transformation.
// PassThrough is possibly the most underrated type of stream, but there are actually
// several circumstances in which it can be a very valuable tool in our toolbelt. For
// instance, PassThrough streams can be useful for observability or to implement late
// piping and lazy stream patterns.