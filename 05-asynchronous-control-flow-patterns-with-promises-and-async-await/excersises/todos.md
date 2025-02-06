Exercises
•done
5.1 Dissecting Promise.all(): Implement your own version of Promise.
all() leveraging promises, async/await, or a combination of the two.
The function must be functionally equivalent to its original counterpart.

pending:
•5.2 TaskQueue with promises: Migrate the TaskQueue class internals from
promises to async/await where possible. Hint: you won't be able to use
async/await everywhere.

•5.3 Producer-consumer with promises: Update the TaskQueuePC class
internal methods so that they use just promises, removing any use of the
async/await syntax. Hint: the infinite loop must become an asynchronous
recursion. Beware of the recursive Promise resolution memory leak!

•5.4 An asynchronous map(): Implement a parallel asynchronous version
of Array.map() that supports promises and a concurrency limit. The
function should not directly leverage the TaskQueue or TaskQueuePC
classes we presented in this chapter, but it can use the underlying patterns.

The function, which we will define as mapAsync(iterable, callback,
concurrency), will accept the following as inputs:
•An iterable, such as an array.
•A callback, which will receive as the input each item of the iterable
(exactly like in the original Array.map()) and can return either
a Promise or a simple value.
•A concurrency, which defines how many items in the iterable can
be processed by callback in parallel at each given time.