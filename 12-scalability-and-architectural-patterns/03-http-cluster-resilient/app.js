import { createServer } from 'http'
import { cpus } from 'os'
import cluster from 'cluster'

if (cluster.isPrimary) {
  const availableCpus = cpus()
  console.log(`Clustering to ${availableCpus.length} processes`)
  availableCpus.forEach(() => cluster.fork())
  cluster.on('exit', (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.process.pid} crashed. Starting a new worker`)
      cluster.fork()
    }
  })
} else {
  setTimeout(
    () => { throw new Error('Ooops') },
    Math.ceil(Math.random() * 3) * 1000
  )
  const { pid } = process
  const server = createServer((req, res) => {
    let i = 1e7; while (i > 0) { i-- }
    console.log(`Handling request from ${pid}`)
    res.end(`Hello from ${pid}\n`)
  })

  server.listen(8080, () => console.log(`Started at ${pid}`))
}

// Clustering to 8 processes
// Started at 31676
// Started at 31687
// Started at 31717
// Started at 31699
// Started at 31677
// Started at 31708
// Started at 31704
// Started at 31678
// file:///node/Node.js-Design-Patterns-Third-Edition/12-scalability-and-architectural-patterns/03-http-cluster-resilient/app.js:17
//     () => { throw new Error('Ooops') },
//             ^

// Error: Ooops
//     at Timeout._onTimeout (file:////node/Node.js-Design-Patterns-Third-Edition/12-scalability-and-architectural-patterns/03-http-cluster-resilient/app.js:17:19)
//     at listOnTimeout (node:internal/timers:573:17)
//     at process.processTimers (node:internal/timers:514:7)

// Node.js v21.5.0
// Worker 31677 crashed. Starting a new worker
// Started at 31814