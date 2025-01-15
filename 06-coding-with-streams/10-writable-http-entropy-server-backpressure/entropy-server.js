import { createServer } from 'http'
import Chance from 'chance'

const chance = new Chance()

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  function generateMore () { // ①
    while (chance.bool({ likelihood: 95 })) {
      const randomChunk = chance.string({ length: (16 * 1024) - 1 }) // ②
      const shouldContinue = res.write(`${randomChunk}\n`) // ③
      if (!shouldContinue) {
        console.log('back-pressure')
        return res.once('drain', generateMore)
      }
    }
    res.end('\n\n')
  }
  generateMore()
  res.on('finish', () => console.log('All data sent'))
})

server.listen(8080, () => {
  console.log('listening on http://localhost:8080')
})

// In Writable streams, the
// highWaterMark property is the limit of the internal buffer size, beyond which the
// write() method starts returning false, indicating that the application should now
// stop writing. When the buffer is emptied, the drain event is emitted, communicating
// that it's safe to start writing again. This mechanism is called backpressure.

// ②
// 16 KB minus 1 byte, which is very close to the
// default highWaterMark limit.