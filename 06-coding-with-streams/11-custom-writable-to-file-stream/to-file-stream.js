import { Writable } from 'stream'
import { promises as fs } from 'fs'
import { dirname } from 'path'
import mkdirp from 'mkdirp-promise'

export class ToFileStream extends Writable {
  constructor (options) {
    super({ ...options, objectMode: true })
  }

  _write (chunk, encoding, cb) {
    mkdirp(dirname(chunk.path))
      .then(() => fs.writeFile(chunk.path, chunk.content))
      .then(() => cb())
      .catch(cb)
  }
}


// Other options accepted by Writable are as follows:

// •highWaterMark (the default is 16 KB): This controls the backpressure limit.
// •decodeStrings (defaults to true): This enables the automatic decoding of
  // strings into binary buffers before passing them to the _write() method. This
  // option is ignored in object mode.