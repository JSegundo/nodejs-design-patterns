import { createServer } from 'http'
import { cpus } from 'os'
import cluster from 'cluster'

if (cluster.isPrimary) { // ①
  const availableCpus = cpus()
  console.log(`Clustering to ${availableCpus.length} processes`)
  availableCpus.forEach(() => cluster.fork())
} else { // ②
  const { pid } = process
  const server = createServer((req, res) => {
    let i = 1e7; while (i > 0) { i-- }
    console.log(`Handling request from ${pid}`)
    res.end(`Hello from ${pid}\n`)
  })

  server.listen(8080, () => console.log(`Started at ${pid}`))
}
// 1 When we launch app.js from the command line, we are actually executing
// the master process. In this case, the cluster.isMaster variable is set
// to true and the only work we are required to do is forking the current
// process using cluster.fork(). In the preceding example, we are starting as
// many workers as there are logical CPU cores in the system to take advantage
// of all the available processing power.

// 2. When cluster.fork() is executed from the master process, the current
// module (app.js) is run again, but this time in worker mode (cluster.
// isWorker is set to true, while cluster.isMaster is false). When the
// application runs as a worker, it can start doing some actual work. In this case,
// it starts a new HTTP server.

// It's important to remember that each worker is a different
// Node.js process with its own event loop, memory space,
// and loaded modules

// Clustering to 8 processes
// Started at 29399
// Started at 29409
// Started at 29430
// Started at 29398
// Started at 29438
// Started at 29405
// Started at 29417
// Started at 29419

// network benchmarking tool
// The preceding command will load the server with 200 concurrent connections for 10
// seconds.
// npx autocannon -c 200 -d 10 http://localhost:8080

// Running 10s test @ http://localhost:8080
// 200 connections

// ┌─────────┬────────┬────────┬────────┬────────┬───────────┬──────────┬───────────┐
// │ Stat    │ 2.5%   │ 50%    │ 97.5%  │ 99%    │ Avg       │ Stdev    │ Max       │
// ├─────────┼────────┼────────┼────────┼────────┼───────────┼──────────┼───────────┤
// │ Latency │ 147 ms │ 264 ms │ 541 ms │ 589 ms │ 293.11 ms │ 100.9 ms │ 892.11 ms │
// └─────────┴────────┴────────┴────────┴────────┴───────────┴──────────┴───────────┘
// ┌───────────┬─────────┬─────────┬─────────┬────────┬─────────┬─────────┬─────────┐
// │ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%  │ Avg     │ Stdev   │ Min     │
// ├───────────┼─────────┼─────────┼─────────┼────────┼─────────┼─────────┼─────────┤
// │ Req/Sec   │ 527     │ 527     │ 711     │ 773    │ 672.82  │ 89.5    │ 527     │
// ├───────────┼─────────┼─────────┼─────────┼────────┼─────────┼─────────┼─────────┤
// │ Bytes/Sec │ 73.8 kB │ 73.8 kB │ 99.6 kB │ 108 kB │ 94.2 kB │ 12.5 kB │ 73.8 kB │
// └───────────┴─────────┴─────────┴─────────┴────────┴─────────┴─────────┴─────────┘