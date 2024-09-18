# pipe 原理

## 文件的 pipe

把手写的可读流和可写流导入，在可读流添加 pipe 方法

```js
const fs = require('fs');
const EventEmitter = require('events');

class ReadStream extends EventEmitter {
  constructor(path, options = {}) {
    super();
    this.path = path;
    this.flags = options.flags || 'r';
    this.encoding = options.encoding || null;
    this.autoClose = options.flags === undefined ? true : options.flags;
    this.start = options.start || 0;
    this.end = options.end || undefined;
    this.highWaterMark = options.highWaterMark || 64 * 1024;
    this.fd = undefined;
    this.offset = this.start;
    this.flowing = false; // 默认为非流动模式
    this.open();
    // 一运行发现监听了 data 事件，就开始读
    this.on('newListener', type => {
      if (type === 'data') {
        this.flowing = true;
        this.read();
      }
    });
  }
  pipe(ws) {
    this.on('data', chunk => {
      let flag = ws.write(chunk);
      if (!flag) {
        this.pause();
      }
    });
    ws.on('drain', () => {
      this.resume();
    });
  }
  pause() {
    this.flowing = false;
  }
  resume() {
    if (!this.flowing) {
      this.flowing = true;
      this.read(); // 继续读取
    }
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        return this.emit('error', err);
      }
      this.fd = fd;
      this.emit('open', fd);
    });
  }
  read() {
    // fs.open 是异步的，这时候 fd 可能还不存在
    if (typeof this.fd !== 'number') {
      return this.once('open', () => this.read());
    }
    // buffer 是引用类型，这里必须是单独创建的 buffer
    const buffer = Buffer.alloc(this.highWaterMark);
    // 真正需要读取的长度，防止读取最末尾几个字节时长度错误
    const readLen =
      this.end === undefined
        ? this.highWaterMark
        : Math.min(this.highWaterMark, this.end - this.offset + 1);
    fs.read(
      this.fd,
      buffer,
      0,
      readLen,
      this.offset,
      (err, bytesRead, buffer) => {
        if (err) {
          return this.emit('error', err);
        }
        if (bytesRead) {
          this.offset += bytesRead;
          this.emit('data', buffer.slice(0, bytesRead));
          if (this.flowing) {
            this.read(); //递归继续读取
          }
        } else {
          // 如果没有读到字节了，就结束
          this.emit('end');
          if (this.autoClose) {
            fs.close(this.fd, () => this.emit('close'));
          }
        }
      },
    );
  }
}

module.exports = ReadStream;
```

```js
const EventEmitter = require('events');
const fs = require('fs');

class WriteStream extends EventEmitter {
  constructor(path, options = {}) {
    super(options);
    this.path = path;
    this.flags = options.flags || 'w';
    this.encoding = options.encoding || 'utf8';
    this.autoClose = options.autoClose === undefined ? true : options.autoClose;
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    this.fd = undefined;
    this.writing = false; // 是否有正在写入的操作
    this.len = 0; // 写入字节的总长度(正在写入+缓存)，判断 highWaterMark 是否已满
    this.needDrain = false; // 是否触发drain事件
    this.offset = 0;
    this.cache = [];
    this.open();
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) return this.emit('error', err);
      this.fd = fd;
      this.emit('open', fd);
    });
  }
  // 用户调用的write方法
  write(chunk, encoding = this.encoding, cb = () => {}) {
    // 用户调用 write 时,数据可能是 string 或 Buffer
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += chunk.length;
    let ret = this.len < this.highWaterMark;
    if (!ret) {
      // highWaterMark 满了或超过的时候，要触发 drian 事件
      this.needDrain = true;
    }
    // 如果正在写入，就缓存起来，否则执行写入
    if (this.writing) {
      this.cache.push({
        chunk,
        encoding,
        cb,
      });
    } else {
      this.writing = true;
      this._write(chunk, encoding, cb);
    }
    return ret;
  }
  // 实际的写入方法
  _write(chunk, encoding, cb) {
    if (typeof this.fd !== 'number') {
      return this.once('open', () => this._write(chunk, encoding, cb));
    }
    fs.write(this.fd, chunk, 0, chunk.length, this.offset, (err, written) => {
      if (err) {
        return this.emit('error', err);
      }
      this.len -= written;
      this.offset += written;
      cb();
      // 每个写入结束后，检查清空缓存区
      this.clearBuffer();
    });
  }
  clearBuffer() {
    let data = this.cache.shift();
    if (data) {
      let { chunk, encoding, cb } = data;
      this._write(chunk, encoding, cb);
    } else {
      // 缓存区清空后，触发 drain 事件
      this.writing = false;
      if (this.needDrain) {
        this.needDrain = false;
        this.emit('drain');
      }
    }
  }
}

module.exports = WriteStream;
```

```js
//------- test.txt -------//
1234567890;
```

```js
//------- copy.txt -------//
```

```js
const ReadStream = require('./ReadStream');
const WriteStream = require('./WriteStream');

let rs = new ReadStream('./test.txt', { highWaterMark: 4 });
let ws = new WriteStream('./copy.txt', { highWaterMark: 1 });
rs.pipe(ws);
ws.on('drain', function() {
  console.log('drain');
});

/*
复制 1234567890 打印出 3 个 drain
drain
drain
drain
*/
```

## process.stdin 的 pipe

process.stdin.on 可以监控用户输入的内容，process.stdout.write 打印出来

```js
process.stdin.on('data', function(chunk) {
  process.stdout.write(chunk);
});

/*
abc
abc
*/
```

用 pipe 等价于下面的代码

```js
process.stdin.pipe(process.stdout);
```
