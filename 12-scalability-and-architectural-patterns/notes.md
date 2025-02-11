<aside>
💡

In its early days, Node.js was just a non-blocking web server written in C++
and JavaScript and was called web.js

</aside>

## Scalability: Capability of a system to grow and adapt to ever-changing conditions.

Its dependent on the growth of a bussiness.

has 6 faces. ‘The scale cube’H

THe capacity that a single thread can support is limited. If we want to use Node.js for high load apps, the only way is to scale it across multiple processes and machines.

## Three dimensions of scalability

### Load distribution:

splitting the load across several processes and machines.

THere are many ways to achieve this, represented in the **scale cube** (Martinb L. abbott, Michael T. Fisher)

- X- axis:
    
    Cloning: Is the most intuitive evolution of a monolithic. It means cloning the same application N times and letting each instance handle 1/nth of the workload. (1000 reqs, 4 instances = 250reqs per instance)
    
- Y-axis: Decomposing by service/funcionality:
    
    Creating diferent, standalone apps, each with its own codebase (maybe also db, ui..)
    It’s the scaling dimension with the biggest repercussions (develpment and operational perspective)
     
    
- Z-axis: Splitting by data partition:
    
     The App is split. each instance is responsible for only a portion of the whole data. (horizontal/vertical partitioning). Its main purpose is overcoming problems related to handling large monolithic datasets. It should be considered only for complex, distributed architectures (Google scale). And after X and Y axes have been fully exploited.
    
    X and Y are the most common in the Node.js ecosystem.
    

## Cloning and load balancing

Nodejs applications are usually scaled sooner compared to traditional web servers that use multiple-threads. THis pushed the developer to take into account scalability from the early stages of an application, making sure the app does not rely on any resource that cannot be shared across mukltiple processes or machines.

The most basic mechanism for scaling is 

## The cluster module

Part of the core Node.js libraries. Simplifies the forking of new instances of the same application and **automatically distributes incoming connections across them.**

The **master process is responsible** for spawning processes (workers, instances of the app) The load is spread across them.

You can spawn as many workers as number of CPUs available in the system. (Automatically done with PM2)

Notes:

The cluester module uses a round-robin load balancing algorithm (inside the master process). It distributes the load evenly across the available servers on a rotational basis. It also has some other behaviours to avoid overloading a given worker process.

When we call server.listen() in a worker process is delegated to the master process. This receives all incoming messages and distribute them to the pool of workers.