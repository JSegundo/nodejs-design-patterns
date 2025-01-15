import { ReplaceStream } from './replace-stream.js'

const replaceStream = new ReplaceStream('World', 'Node.js')
replaceStream.on('data', chunk => console.log(chunk.toString()))

replaceStream.write('Hello W')
replaceStream.write('orld!')
replaceStream.end()


// Transform vs Duplex:

// Duplex: Input and output are independent (like a phone call - talking and listening are separate)
// Transform: Input is modified and becomes output (like a translator in a phone call)