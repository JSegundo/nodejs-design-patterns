import { spider } from "./spider.js"

const url = process.argv[2]
const nesting = Number.parseInt(process.argv[3], 10) || 1
// The nesting parameter controls how deep we go when crawling links. Think of it like this:
// nesting = 1: Only download the main page
// nesting = 2: Download main page and all its links
// nesting = 3: Download main page, its links, and links from those links
spider(url, nesting, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log("Download complete")
})
