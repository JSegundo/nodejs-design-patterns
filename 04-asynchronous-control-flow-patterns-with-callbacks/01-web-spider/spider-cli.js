import { spider } from "./spider.js"

// It starts on 2 because process.argv contains the whole command-line invocation:

spider(process.argv[2], (err, filename, downloaded) => {
  console.log(process.argv)
  if (err) {
    console.error(err)
  } else if (downloaded) {
    console.log(`Completed the download of "${filename}"`)
  } else {
    console.log(`"${filename}" was already downloaded`)
  }
})
