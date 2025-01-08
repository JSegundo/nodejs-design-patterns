# Node.js Design Patterns - Some learning notes

Random stuff I'm learning while reading the book. Raw notes.


### Promises & Async 
- `.then()` returns another promise immediately. All promises in the chain are created right away, but execution happens in sequence and always async:
```js
fetch('user.json')           // Promise A
.then(res => res.json())     // Promise B - created now, runs later
.then(user => fetch(user.photo)) // Promise C - same
.then(photo => displayPhoto())   // Promise D - same
```

- `.catch()` can transform errors into success:
```js
Promise.reject('error')
.catch(err => 'recovered')  // Error -> Success
.then(value => ...)        // Chain continues normally
```

- `Promise.resolve()` - Provides initial chain link for building promise chains

### Async/Await Insights
- Async functions always return a promise synchronously
```js
const data = await someAsyncFunc()
// data is immediately an unfulfilled promise
```

### Practical Patterns
- It's normal to "promisify" callback-based functions to use promises instead
- Queues are used for limiting concurrent tasks - too many parallel processes can saturate the system
- Pub/sub is one way to implement event-driven architecture

### Useful Libraries
- Async: Most installed NPM package. Wraps control flow patterns into reusable functions
- p-map: Like Promise.all() but with controlled concurrency and error handling
```js
pMap(sites, mapper, {concurrency: 2});
```

*Notes will be updated as I continue reading...*

 ❤️
