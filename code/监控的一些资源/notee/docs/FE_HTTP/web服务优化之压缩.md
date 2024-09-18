# web 服务优化之压缩

### 1.前置知识

缓存和压缩是 web 服务优化的大杀器。这里以 gzip 为例讲解原理。

在 nodejs 里，可以用**Zlib**模块对资源进行压缩。

- 浏览器通过 HTTP 请求头部里加上**Accept-Encoding**，告诉服务器的压缩方式。`Accept-Encoding: gzip, deflate`。所以一般压缩前需要判断一下。`req.headers['accept-encoding'].includes('gzip')`

- 返回压缩过的文件也需要告诉浏览器，这个文件用什么方式压缩过`res.setHeader('Content-Encoding', 'gzip')`
- gzip 接受**Buffer**、**ArrayBuffer**、**string** 格式

- gzip 是根据替换来实现的，所以数据的重复率越高，压缩后的结果越小

### 2.通过创建转换流，对文件进行压缩

```js
const zlib = require('zlib');
const fs = require('fs');

const input = fs.createReadStream('1.txt'); // 读取要压缩的文件，读取流
const output = fs.createWriteStream('2.txt.gz'); // 写入压缩完后的文件，写入流
const gzip = zlib.createGzip(); // 转化流

input.pipe(gzip).pipe(output);
//fs.createReadStream('./1.txt').pipe(zlib.createGzip()).pipe(fs.createWriteStream('2.txt.gz'));

// 解压用法基本一致，读取压缩后的文件(x.txt.gz)，写入解压后的文件，转化流是 zlib.createGunzip()
```

### 3.调用 zlib 方法进行压缩和解压

```js
const zlib = require('zlib');
const fs = require('fs');

// 文件压缩
zlib.gzip(fs.readFileSync('./1.txt'), (err, data) => {
  if (err) {
    return console.log(err);
  }
  fs.writeFileSync('2.txt.gz', data);
});

// 字符串压缩，并把 buffer 转成 base64 打印出来
const str = 'zhuwenhua';
zlib.gzip(str, (err, data) => {
  if (err) {
    return console.log(err);
  }
  console.log(data.toString('base64'));
});
// H4sIAAAAAAAAE6vKKC1PzcsoTQQA9hrvjAkAAAA=

// 解压，把 base64 转成 buffer 进行解压，转成字符串
const buffer = Buffer.from(
  'H4sIAAAAAAAAE6vKKC1PzcsoTQQA9hrvjAkAAAA=',
  'base64',
);
zlib.gunzip(buffer, (err, buffer) => {
  if (err) {
    return console.log(err);
  }
  console.log(buffer.toString());
});
// zhuwenhua
```

### 4.其他

- 可以用同步方法 `zlib.gzipSync()`， `zlib.gunzipSync()`

- `deflate`压缩方法基本一致，详见官方文档 [zlib 文档](http://nodejs.cn/api/zlib.html)
