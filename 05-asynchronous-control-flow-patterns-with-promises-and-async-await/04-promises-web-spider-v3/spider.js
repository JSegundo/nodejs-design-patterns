import { promises as fsPromises } from 'fs'
import { dirname } from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename, getPageLinks } from './utils.js'
import { promisify } from 'util'

const mkdirpPromises = promisify(mkdirp)

function download (url, filename) {
  console.log(`Downloading ${url}`)
  let content
  return superagent.get(url)
    .then(res => {
      content = res.text
      return mkdirpPromises(dirname(filename))
    })
    .then(() => fsPromises.writeFile(filename, content))
    .then(() => {
      console.log(`Downloaded and saved: ${url}`)
      return content
    })
}

function spiderLinks (currentUrl, content, nesting) {
  if (nesting === 0) {
    return Promise.resolve()
  }

  const links = getPageLinks(currentUrl, content)
  const promises = links
    .map(link => spider(link, nesting - 1))

  return Promise.all(promises)
}

const spidering = new Set()
export function spider (url, nesting) {
  if (spidering.has(url)) {
    return Promise.resolve()
  }
  spidering.add(url)

  const filename = urlToFilename(url)
  return fsPromises.readFile(filename, 'utf8')
    .catch((err) => {
      if (err.code !== 'ENOENT') {
        throw err
      }

      // The file doesn't exist, so let’s download it
      return download(url, filename)
    })
    .then(content => spiderLinks(url, content, nesting))
}

// // Starting Point:
// spider('main.html', 2)

// // Step 1: Download main.html
// // - Checks if file exists
// // - If not, downloads it
// // - Gets content with links: ['page1.html', 'page2.html']

// // Step 2: spiderLinks runs and creates array of promises
// promises = [
//     spider('page1.html', 1),  // runs immediately
//     spider('page2.html', 1)   // runs immediately
// ]

// // Step 3: Promise.all runs all promises in parallel
// Promise.all(promises)

// // Each spider('page1.html', 1) and spider('page2.html', 1):
// // - Checks if file exists
// // - Downloads if needed
// // - Processes its own links (with nesting - 1)


// Promise.all() will reject immediately
// if any of the promises in the input array reject. This is exactly what we wanted for
// this version of our web spider.
//----------------------------------------------------------------
// There is no limited concurrency, could lead to problems because
// If a page has 100 links, this will start 100 downloads at once:
// const links = getPageLinks(currentUrl, content)
// const promises = links.map(link => spider(link, nesting - 1))
// return Promise.all(promises)

// Could be improved using a TaskQueue.

// THere is also a npm package called pMap: Map over promises concurrently
// pMap(sites, mapper, {concurrency: 2});
// This is different from Promise.all() in that you can control the concurrency and also decide whether or not to stop iterating when there's an error.

