// 5.1 Dissecting Promise.all(): Implement your own version of Promise.
// all() leveraging promises, async/await, or a combination of the two.
// The function must be functionally equivalent to its original counterpart.

// Promise.all() takes an array of promises and returns a single promise that resolves when all of the promises in the array have resolved. If any of the promises in the array are rejected, the promise returned by Promise.all() is rejected.

// The biggest "aha moment" should be that Promise.all() isn't just about collecting results - it's about creating a new promise that orchestrates multiple other promises and only completes when they all do. Each step (starting promises, collecting results, tracking completion, handling errors) needs to be connected through the promise chain.

 function all(promises) {     
    return new Promise((resolve,reject) => {
        if(promises.length === 0) resolve([])
        const results = new Array(promises.length)
        let completed = 0
      
        for (let index = 0; index < promises.length; index++) {
            const promise = promises[index];
            promise.then((res) => {
                results[index] = res
                completed++
                if(completed === results.length) resolve(results)
            })
            .catch((err) => reject(err))            
        }
    })
}

// async-await version
async function awaitall(promises) {
    if(promises.length === 0) return []
    const results = new Array(promises.length)

    for (let i = 0; i < promises.length; i++) {
        try {
            results[i] = await promises[i]  // Guaranteed correct order
        } catch(err) {
            throw err
        }
    }
    return results
}

// When you write:
// async function foo() {
//     return 123;
// }

// // JavaScript actually does something like:
// function foo() {
//     return new Promise((resolve) => {
//         resolve(123);
//     });
// }

// ### throwing errors
// async function asyncFunction() {
//     throw "error!";  // Creates a rejected promise!
// }

// // Same as:
// function asyncFunction() {
//     return new Promise((resolve, reject) => {
//         reject("error!");
//     });
// }

const p1 = Promise.resolve(1)
const p2 = new Promise(r => setTimeout(() => r(2), 100))
const p3 = Promise.reject('boom').catch(err => console.error(err))

// Your current implementation would return [] immediately
awaitall([p1,p2,p3])
  .then(results => console.log('Success:', results))
  .catch(err => console.log('Error:', err))


