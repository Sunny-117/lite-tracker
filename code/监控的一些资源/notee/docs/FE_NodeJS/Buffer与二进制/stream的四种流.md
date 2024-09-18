# stream 的四种流

#### stream 的可读流和可写流

```js
const { Duplex, Transform, Readable, Writable } = require('stream');
class MyDuplex extends Duplex {
  _read() {
    this.push('xxx');
    this.push(null);
  }
  _write(chunk, encoding, cb) {
    console.log(chunk);
    cb(); // clearBuffer
  }
}
let md = new MyDuplex();
md.on('data', function(chunk) {
  console.log(chunk);
});
md.write('ok');
```

#### stream 的转化流

```js
class MyTransfrom extends Transform {
  _transform(chunk, encoding, cb) {
    // 这里可以调用push方法
    this.push(chunk.toString().toUpperCase()); // this.emit()
    cb();
  }
}
let my = new MyTransfrom();

process.stdin.pipe(my).pipe(process.stdout);

/*

abc
ABC

*/
```
