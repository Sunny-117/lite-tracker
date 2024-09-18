# http 服务

#### 启动 http 服务

```js
const http = require('http');
const url = require('url');

// http://localhost:3000/dir?a=1#hash
let server = http.createServer((req, res) => {
  console.log(req.method); // 请求方法(大写)
  console.log(req.url); // / 后面的 # 前面的 /dir?a=1
  let { pathname, query } = url.parse(req.url, true); // true 查询参数转为对象
  console.log(pathname); // /dir
  console.log(query); // { a: '1' }
  console.log(req.headers); // 所有的请求头信息(key都是小写)

  res.end('ok');
});

let port = 3000;
server.listen(port, function() {
  console.log(`server start ${port}`);
});
// 监听服务器错误，如果是端口占用错误，port+1 再重新 listen()
server.on('error', function(err) {
  if (err.errno === 'EADDRINUSE') {
    server.listen(++port); // listen是发布订阅模式，不用再传回调
  }
});
```

#### 分段读取数据

> req 是一个可读流，可以分段读取数据

```js
let arr = []; // 前端传递的数据可能是二进制，用buffer拼接是最安全的

req.on('data', function(chunk) {
  // 如果流中的数据为空，内部会调用 push(null)
  arr.push(chunk);
});

req.on('end', function() {
  console.log(Buffer.concat(arr).toString());
});
```

#### 分段响应请求

> res 是一个可写流。如果服务端是分段响应，浏览器响应头 Headers 会带 `Transfer-Encoding: chunkeds`

```js
res.write('1');
res.write('2');
res.write('3');
res.end('ok'); // 标识响应结束
```

#### res 其他相关方法

```js
res.statusCode = 200; // 设置响应状态码
res.statusMessage = 'no stauts'; // 设置响应状态信息(一般默认)
res.setHeader('a', 1); // 设置响应自定义头信息
```

##### url.parse() 方法

```js
let { hostname, pathname, query, ...other } = url.parse(
  'http://username:password@localhost:3000/dir?a=1',
  true,
);
// hostname 主机名 localhost
// pathname 请求路径 /dir
// query 查询参数 { a: '1' }
```

##### query 格式化对象

```js
let query = {};
req.url.replace(/([^&?=]+)=([^&?=]+)/g, function() {
  query[arguments[1]] = arguments[2];
});
console.log(query);
```
