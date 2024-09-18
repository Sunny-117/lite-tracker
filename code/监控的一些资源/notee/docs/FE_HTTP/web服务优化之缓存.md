# web 服务优化之缓存

### 1.前置知识

缓存和压缩是 web 服务优化的大杀器。我们希望有些资源前端可以从浏览器去取，可以通过设定 Header 来配置缓存。

缓存是通过响应头`res.setHeader()`设置的，所以可以给请求单独设置。

### 2.配置强制缓存

强制缓存就是指定时间内，不再向服务器发起请求，直接去浏览器拿资源。

前端 chrome 的控制台可以看到发出请求为，Size:`from memory cache`，Status: `200`，服务器也不会收到这个请求。

强制缓存默认不缓存**请求的页面**，只缓存请求页面的**资源**(css、js)

HTTP 1.0 版本配置强制缓存是给`Expires`头加上**绝对时间**的字符串，HTTP 1.1 版本配置强制缓存是给`Cache-Control`头加上**相对时间**。开发中一般我们会做兼容把两种都加上，比如我想给服务器配置 10 秒的强制缓存。

```js
res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString()); // http1.0
res.setHeader('Cache-Control', 'max-age=10'); // http1.1
```

Cache-Control 还有两个值

- `no-cache` 表示浏览器进行缓存但每次都向服务器发请求
- `no-store` 表示浏览器不进行缓存

强制缓存设置好了，但现在有一个问题，如果服务器的文件有修改，那也是 10 秒后再次请求才能拿到最新文件。这时候就要用到**协商缓存**了

### 3.配置协商缓存

协商缓存，每次请求都会对比缓存文件和服务器文件，服务器文件没有修改过，就返回 304，浏览器会自动去取本地的缓存文件

1. **修改时间对比**

返回文件时通过设置`Last-Modified`头给缓存标记最后修改时间，下次请求时会自动带上这个信息，服务器会去对比缓存文件的最后修改时间和服务器的最后修改时候，判断服务器文件有没有修改过

```js
// 简易静态资源服务

const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');

http
  .createServer(async (req, res) => {
    // http://localhost:3000/index.html
    const { pathname } = url.parse(req.url); // index.html
    const filePath = path.join(__dirname, pathname); // ./index.html

    res.setHeader('Cache-Control', 'no-Cache'); // 每次询问服务器
    let ifModifiedSince = req.headers['if-modified-since']; // 服务端拿到缓存文件的最后修改时间

    let statObj = await fs.stat(filePath);
    let LastModified = statObj.ctime.toGMTString(); // 当前服务器文件的最后修改时间

    // 如果服务器文件的最后修改时间和缓存文件的最后修改时间一致，即服务器文件没有修改过，返回 304
    if (ifModifiedSince === LastModified) {
      res.statusCode = 304;
      return res.end();
    }

    res.setHeader('Last-Modified', LastModified); // 给缓存文件设置最后修改时间
    let results = await fs.readFile(filePath, 'utf8');
    res.end(results); // 返回文件
  })
  .listen(3001);
```

请求里的最后修改是这样的， `Last-Modified: Wed, 14 Oct 2019 10:39:46 GMT`。时间单位是秒，不够不精准，如果一秒内修改几次，服务器是监控不到的。这时候就要用到**指纹比对**。

2. **指纹对比**

**MD5 信息摘要算法**（Message-Digest Algorithm）,可以根据**string**或**buffer**生成长度一样的值。

和**修改时间对比**类似，返回文件时通过设置`Etag`头给缓存标记 md5 值。

```js
const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

http
  .createServer(async (req, res) => {
    // http://localhost:3000/index.html
    const { pathname } = url.parse(req.url); // index.html
    const filePath = path.join(__dirname, pathname); // ./index.html

    res.setHeader('Cache-Control', 'no-Cache'); // 每次询问服务器
    let ifNoneMatch = req.headers['if-none-match']; // 服务端拿到缓存文件 md5

    let fileBuffer = await fs.readFile(filePath);
    let fileHash = crypto
      .createHash('md5')
      .update(fileBuffer)
      .digest('base64'); // 当前服务器文件的 md5

    // 如果服务器文件的 md5 和缓存文件的 md5 一致，即服务器文件没有修改过，返回 304
    if (fileHash === ifNoneMatch) {
      res.statusCode = 304;
      return res.end();
    }

    res.setHeader('Etag', fileHash); // 给缓存文件设置 md5
    let results = await fs.readFile(filePath, 'utf8');
    res.end(results); // 返回文件
  })
  .listen(3001);
```

注意：这里是简单粗暴的把整个文件的 buffer 拿去生成 md5，实际项目中为了更好的性能可以只取文件内容的**开头部分** + **文件的大小**去生成 md5

### 3.强制缓存和协商缓存组合

通常项目中是强制缓存和协商缓存组合一起用的。

1. 第一次请求文件后，10s 内的请求会采用浏览器缓存，不会发送请求到服务器中。

2. 10s 后的请求服务器会接收到，并进行进行对比。如果文件修改时间和文件摘要都没有变化，返回 304，浏览器会自动去取本地的缓存文件。否则返回新文件，并设置后面的 10 秒内的请求走强制缓存。
3. 10s 内不再发请求。以此循环。

```js
// 简易静态资源服务

const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

http
  .createServer(async (req, res) => {
    // http://localhost:3000/index.html
    const { pathname } = url.parse(req.url); // index.html
    const filePath = path.join(__dirname, pathname); // ./index.html

    // 后面的10秒内的请求走强制缓存
    res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString());
    res.setHeader('Cache-Control', 'max-age=10');

    let ifModifiedSince = req.headers['if-modified-since']; // 服务端拿到缓存文件的最后修改时间
    let ifNoneMatch = req.headers['if-none-match']; // 服务端拿到缓存文件 md5

    let statObj = await fs.stat(filePath);
    let LastModified = statObj.ctime.toGMTString(); // 当前服务器文件的最后修改时间

    let fileBuffer = await fs.readFile(filePath);
    let fileHash = crypto
      .createHash('md5')
      .update(fileBuffer)
      .digest('base64'); // 当前服务器文件的 md5

    // 修改时间对比和指纹比对都通过，即服务器文件没有修改过，返回 304。否则返回新文件
    if (LastModified === ifModifiedSince && fileHash === ifNoneMatch) {
      res.statusCode = 304;
      return res.end();
    }

    res.setHeader('Last-Modified', LastModified); // 给缓存文件设置最后修改时间
    res.setHeader('Etag', fileHash); // 给缓存文件设置 md5
    let results = await fs.readFile(filePath, 'utf8');
    res.end(results); // 返回文件
  })
  .listen(3001);
```
