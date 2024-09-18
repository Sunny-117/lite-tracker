# CompletableFuture 异步并发

```java
var aFuture = CompletableFuture.supplyAsync(()->{
   //.....
   return xxx;
});
var bFuture = CompletableFuture.supplyAsync(()->{
   //.....
   return xxx;
});
var cFuture = CompletableFuture.supplyAsync(()->{
   //.....
   return xxx;
});
//并行处理
CompletableFuture
  .allOf(aFuture,
		bFuture,
		cFuture)
.join();
//取值
var a= aFuture.get();
var b= bFuture.get();
var c= cFuture.get();
```
