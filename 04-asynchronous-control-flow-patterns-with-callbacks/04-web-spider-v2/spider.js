import fs from "fs"
import path from "path"
import superagent from "superagent"
import mkdirp from "mkdirp"
import { urlToFilename, getPageLinks } from "./utils.js"

function saveFile(filename, contents, cb) {
  mkdirp(path.dirname(filename), (err) => {
    if (err) {
      return cb(err)
    }
    fs.writeFile(filename, contents, cb)
  })
}

function download(url, filename, cb) {
  console.log(`Downloading ${url}`)
  superagent.get(url).end((err, res) => {
    if (err) {
      return cb(err)
    }
    saveFile(filename, res.text, (err) => {
      if (err) {
        return cb(err)
      }
      console.log(`Downloaded and saved: ${url}`)
      cb(null, res.text)
    })
  })
}

function spiderLinks(currentUrl, body, nesting, cb) {
  if (nesting === 0) {
    // Remember Zalgo? .. avoid mixing sync and async execution
    return process.nextTick(cb)
  }

  const links = getPageLinks(currentUrl, body) // [1]
  if (links.length === 0) {
    return process.nextTick(cb)
  }

  function iterate(index) {
    // [2]
    if (index === links.length) {
      return cb()
    }

    spider(links[index], nesting - 1, function (err) {
      // [3]
      if (err) {
        return cb(err)
      }
      iterate(index + 1)
    })
  }

  iterate(0) // [4]
}

export function spider(url, nesting, cb) {
  const filename = urlToFilename(url)
  fs.readFile(filename, "utf8", (err, fileContent) => {
    if (err) {
      if (err.code !== "ENOENT") {
        // if is ENOENT means it doesnt exists
        return cb(err)
      }

      // The file doesn't exist, so let’s download it
      return download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err)
        }

        spiderLinks(url, requestContent, nesting, cb)
      })
    }

    // The file already exists, let’s process the links
    spiderLinks(url, fileContent, nesting, cb)
  })
}

// The pattern
// The code of the spiderLinks() function from the previous section is a clear example of how it's possible to iterate over a collection while applying an asynchronous operation. You may also notice that it's a pattern that can be adapted to any other situation where we need to iterate asynchronously over the elements of a collection or, in general, over a list of tasks. This pattern can be generalized as follows:

// function iterate (index) {
// if (index === tasks.length) {
// return finish()
// }
// const task = tasks[index]
// task(() => iterate(index + 1))
// }
// function finish () {
// // iteration completed
// }
// iterate(0)
