// 4.1 File concatenation: Write the implementation of concatFiles(), a
// callback-style function that takes two or more paths to text files in the
// filesystem and a destination file:
// function concatFiles (srcFile1, srcFile2, srcFile3, ... ,
// dest, cb) {
// // ...
// }
// This function must copy the contents of every source file into the destination
// file, respecting the order of the files, as provided by the arguments list.
// For instance, given two files, if the first file contains foo and the second
// file contains bar, the function should write foobar (and not barfoo) in the
// destination file. Note that the preceding example signature is not valid
// JavaScript syntax: you need to find a different way to handle an arbitrary
// number of arguments. For instance,
import * as fs from 'node:fs/promises';

// First, create test files - note the fs. prefix and await
await fs.writeFile('file1.txt', 'Hello ')
await fs.writeFile('file2.txt', 'from ')
await fs.writeFile('file3.txt', 'Node.js!')

function concatFiles(dest, cb, ...srcfiles) {
    const fileContents = []

    function iterate(index) {
        if (index === srcfiles.length) {
            fs.writeFile(dest, fileContents.join('')).then(() => {
                cb()
            }).catch(err => {
                cb(err)
            })
            return
        }

        fs.readFile(srcfiles[index], 'utf8')
            .then(data => {
                fileContents.push(data)
                iterate(index + 1)
            })
            .catch(err => cb(err))
    }

    iterate(0)
}

// Test the function
concatFiles(
    'output.txt',
    (err) => {
        if (err) {
            console.error('Error:', err)
            return
        }
        console.log('Files concatenated successfully!')
        // Read and verify the result
        fs.readFile('output.txt', 'utf8')
            .then(result => console.log('Result:', result))
            .catch(err => console.error('Error reading result:', err))
    },
    'file1.txt',
    'file2.txt',
    'file3.txt'
)