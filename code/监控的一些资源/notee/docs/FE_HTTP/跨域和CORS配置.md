# 跨域和 CORS 配置

### 1.为什么需要 CORS

我们都知道浏览器有同源策略，即一个域名的网页去请求另一个域名的资源时**协议、域名、端口**必须相同。如果有一个不同就跨域了。

现在使用最广的 AJXA 默认只支持**同源**（form 表单提交没有这个这个限制，所以 form 表单是不会跨域的）

如果前端页面和后台接口不是放在同一个服务器下面的，怎样解决跨域问题呢？这时候就要用到 CORS 了

CORS 是一个 W3C 标准，全称是"跨域资源共享"（Cross-origin resource sharing）。它允许浏览器向跨源服务器，发出`XMLHttpRequest`请求，从而克服了 AJAX 只能**同源**使用的限制。

### 2.怎样配置 CORS

浏览器一旦发现 AJAX 请求跨源，就会自动添加一些附加的头信息，即 CORS 请求，有时还会多出一次附加的请求，所以服务端只需要根据请求头信息来配置响应头信息就可以了

假如我发了这个 AJAX 请求

```js
const xhr = new XMLHttpRequest();
xhr.open('POST', 'http://localhost:3000/test', true); // 异步提交
xhr.setRequestHeader('Content-Type', 'application/json'); // 自定义Content-Type
xhr.send(JSON.stringify({ name: 'zwh' }));
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200) {
    console.log(xhr.response);
  }
};
```

服务端需要在收到请求的第一时间做如下配置

```js
res.setHeader('Access-Control-Allow-Origin', '*'); // 允许任何网站的访问
res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 允许请求携带的自定义头 Content-Type
```

这样就配置好了吗？不，还差一步。

因为上面的请求是复杂请求，为复杂请求的 CORS 请求，会在正式通信之前，增加一次方法为`OPTIONS`的请求，称为"预检"请求，看看请求能不能跑通。预检服务器是需要做回应的，否则浏览器不会发送真正的请求

先来说说什么是简单请求和复杂请求

### 3.简单请求和复杂请求

只要**同时满足**以下两个条件，就属于简单请求。

> （1) 请求方法是以下三种方法之一：
>
> - HEAD
> - GET
> - POST
>
> （2）HTTP 的头信息不超出以下几种字段：
>
> - Accept
> - Accept-Language
> - Content-Language
> - Last-Event-ID
> - Content-Type：只限于三个值`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`

所以为什么上面那个请求是复杂请求？因为 AJAX 设置了`Content-Type: application/json`

那怎样处理预检请求呢，非常简单，在配置 CORS 的代码后面加上这一段就可以了

```js
if (req.method === 'OPTIONS') {
  res.statusCode = 200;
  res.end();
}
```

意思是只要是预检请求，通过就可以了。

另外

预检请求浏览器默认是 10 秒，就是说 10 秒内的请求只发送一次预检请求。

Access-Control-Max-Age 用来指定本次预检请求的有效期，单位为秒，一般开发时是设置为 30 分钟

```js
res.setHeader('Access-Control-Max-Age', '1800'); // 表示隔30分钟才发起预检请求
res.setHeader('Access-Control-Max-Age', '0'); // 表示每次异步请求都发起预检请求
```

完

**前端代码**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script>
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000/test', true); // 异步提交
      xhr.setRequestHeader('Content-Type', 'application/json'); // 自定义Content-Type
      xhr.send(JSON.stringify({ name: 'zwh' }));
      xhr.responseType = 'json'; // 浏览器把json字符串解析成对象
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          console.log(xhr.response);
        }
      };
      // xhr.onload = function () { // xhr.readyState == 4 xhr.status == 200
      //     console.log(xhr.response)
      // }
    </script>
  </body>
</html>
```

**后台代码**

```js
const http = require('http');
const url = require('url');
let server = http.createServer((req, res) => {
  let { pathname } = url.parse(req.url);

  // 配置Header
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin); // 允许任何网站的访问
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization'); // 允许请求携带的自定义头Content-Type 和 Authorization
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT'); // 允许请求的方法。不设置就是默认支持的 get 和 post
  res.setHeader('Access-Control-Max-Age', '1800'); // 表示隔30分钟才发起预检请求

  // 如果是options请求，直接成功
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
  }

  // 接收数据
  const arr = [];
  req.on('data', function(chunk) {
    arr.push(chunk);
  });
  req.on('end', function() {
    let result = Buffer.concat(arr).toString();
    // result = querystring.parse(result, '&', '=');

    if (pathname === '/test' && req.method == 'POST') {
      res.end(result);
    }
  });
});

server.listen(3000);
```
