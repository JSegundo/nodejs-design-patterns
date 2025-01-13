import { promises as fs } from 'fs'
import { gzip } from 'zlib'
import { promisify } from 'util'
import buffer from 'buffer'
console.log(buffer.constants.MAX_STRING_LENGTH)

const gzipPromise = promisify(gzip)

const filename = process.argv[2]

async function main () {
  const data = await fs.readFile(filename)
  const gzippedData = await gzipPromise(data)
  await fs.writeFile(`${filename}.gz`, gzippedData)
  console.log('File successfully compressed')
}

main()

// node gzip-buffer.js <path to file>

// If we choose a file that is big enough (for instance, about 8 GB), we will most likely
// receive an error message saying that the file that we are trying to read is bigger than
// the maximum allowed buffer size:

// RangeError [ERR_FS_FILE_TOO_LARGE]: File size (8130792448) is greater
// than possible Buffer: 2147483647 bytes

// That's exactly what we expected, and it's a symptom of the fact that we are using the
// wrong approach.