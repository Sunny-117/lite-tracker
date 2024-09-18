# Event Loop

## Event Loop 是什么

想要理解 Event Loop，就要从程序的运行模式讲起。

计算机里调度任务和分配任务的最小单位是进程，每个进程中可以包含着很多线程。

浏览器是一个多进程模型，每个标签页、插件都是独立进程，能保证一个崩溃之后其他的还能正常运行。每个标签页都有一个渲染进程。

JavaScript 主线程是单线程的。作为浏览器脚本语言，JavaScript 的主要用途是与用户互动，以及操作 DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定 JavaScript 同时有两个线程，一个线程在某个 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

所以 JavaScript 要采用 Event Loop 机制，来解决单线程运行带来的一些问题，在这里我们可以简单的理解成 JavaScript 代码的执行顺序。

另外主线程是可以开其他线程，比如定时器、ajax、事件等。

## 宏任务和微任务

**宏任务，macrotask。**宿主环境提供的异步方法都是宏任务：

- setTimeout
- 事件
- ajax
- UI 渲染
- script 脚本
- I/O
- setImmediate (IE 和 node)
- MessageChannel
- requestAnimationFrame

**微任务，microtask。** 语言本身提供的是微任务：

- promise.then
- MutationObserver
- process.nextTick (node)

## 浏览器的 Event Loop

第一次会执行 script 宏任务代码，

执行代码时，会把所有的微任务放入**微任务队列**，把所有的宏任务放入**宏任务队列**，

完成后，先把**微任务队列**全部放入执行栈（同时运行），

再运行 GUI 渲染（浏览器会做优化，不是每次都会执行），

再从**宏任务队列**(先进先出)中取出一个**宏任务**放入执行栈，

以此循环。

![img](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/19-16-21-Fi3aj4.jpg)
