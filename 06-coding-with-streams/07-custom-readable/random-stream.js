import { Readable } from 'stream'
import Chance from 'chance'

const chance = new Chance()

export class RandomStream extends Readable {
  constructor (options) {
    super(options)
    this.emittedBytes = 0
  }

  _read (size) {
    const chunk = chance.string({ length: size }) // ①
    this.push(chunk, 'utf8') // ②
    this.emittedBytes += chunk.length
    if (chance.bool({ likelihood: 5 })) { // ③
      this.push(null)
    }
  }
}

// The possible parameters that can be passed through the options object include the
// following:
// •The encoding argument, which is used to convert buffers into strings
// (defaults to null)
// •A flag to enable object mode (objectMode, defaults to false)
// •The upper limit of the data stored in the internal buffer, after which no more
// reading from the source should be done (highWaterMark, defaults to 16KB)
// Okay, now let's explain the _read() method:
// 1. The method generates a random string of length equal to size using chance.
// 2. It pushes the string into the internal buffer. Note that since we are pushing
// strings, we also need to specify the encoding, utf8 (this is not necessary if the
// chunk is simply a binary Buffer).
// 3. It terminates the stream randomly, with a likelihood of 5 percent, by pushing
// null into the internal buffer to indicate an EOF situation or, in other words,
// the end of the stream.