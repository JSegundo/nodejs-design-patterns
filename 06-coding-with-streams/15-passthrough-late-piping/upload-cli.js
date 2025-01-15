import { createReadStream } from 'fs'
import { createBrotliCompress } from 'zlib'
import { PassThrough } from 'stream'
import { basename } from 'path'
import { upload } from './upload.js'

const filepath = process.argv[2] // ①
const filename = basename(filepath)
const contentStream = new PassThrough() // ②

upload(`${filename}.br`, contentStream) // ③
  .then((response) => {
    console.log(`Server response: ${response.data}`)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

createReadStream(filepath) // ④
  .pipe(createBrotliCompress())
  .pipe(contentStream)

// 1. We get the path to the file we want to upload from the first command-line
// argument and use basename to extrapolate the filename from the given path.
// 2. We create a placeholder for our content stream as a PassThrough instance.
// 3. Now, we invoke the upload function by passing our filename (with the
// added .br suffix, indicating that it is using the Brotli compression) and the
// placeholder content stream.
// 4. Finally, we create a pipeline by chaining a filesystem Readable stream, a
// Brotli compression Transform stream, and finally our content stream as the
// destination.

// When this code is executed, the upload will start as soon as we invoke the upload()
// function (possibly establishing a connection to the remote server), but the data will
// start to flow only later, when our pipeline is initialized. Note that our pipeline will
// also close the contentStream when the processing completes, which will indicate to
// the upload() function that all the content has been fully consumed.

// Note:
// Use a PassThrough stream when you need to provide a
// placeholder for data that will be read or written in the future.