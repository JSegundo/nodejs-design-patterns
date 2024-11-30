import fs from "fs"
import path from "path"
import superagent from "superagent"
import mkdirp from "mkdirp"
import { urlToFilename } from "./utils.js"

// export function spider (url, cb) {
//   const filename = urlToFilename(url)
//   fs.access(filename, err => { // [1]
//     if (err && err.code === 'ENOENT') {
//       console.log(`Downloading ${url} into ${filename}`)
//       superagent.get(url).end((err, res) => { // [2]
//         if (err) {
//           cb(err)
//         } else {
//           mkdirp(path.dirname(filename), err => { // [3]
//             if (err) {
//               cb(err)
//             } else {
//               fs.writeFile(filename, res.text, err => { // [4]
//                 if (err) {
//                   cb(err)
//                 } else {
//                   cb(null, filename, true)
//                 }
//               })
//             }
//           })
//         }
//       })
//     } else {
//       cb(null, filename, false)
//     }
//   })
// }

// refactored
// early return principle
export function spider(url, cb) {
  const filename = urlToFilename(url)
  fs.access(filename, (err) => {
    if (err && err.code === "ENOENT") {
      console.log(`Downloading ${url} into ${filename}`)
      superagent.get(url).end((err, res) => {
        if (err) return cb(err)
        mkdirp(path.dirname(filename), (err) => {
          if (err) return cb(err)
          fs.writeFile(filename, res.text, (err) => {
            if (err) return cb(err)
            cb(null, filename, true)
          })
        })
      })
    } else {
      cb(null, filename, false)
    }
  })
}

// A common mistake when executing the optimization just described
// is forgetting to terminate the function after the callback is invoked.
// For an error-handling scenario, the following code is a typical
// source of defects:
// if (err) {
// callback(err)
// }
// We should never forget that the execution of our function will
// continue even after we invoke the callback.
