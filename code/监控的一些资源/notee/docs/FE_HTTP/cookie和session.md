# cookie 和 session

### 1.cookie、localStorage、sessionStorage 的区别

- localStorage 和 sessionStorage 是本地存储，发送请求时是不携带的
- localStorage 浏览器关闭后不会销毁，sessionStorage 浏览器关闭后就销毁
- localStorage 和 sessionStorage 都不能跨域设置或者访问数据
- cookie 在客户端和服务端都能写入和读取
- cookie 同端口父域设置子域可以访问。.zwh.com 设置，a.zwh.com 可以访问
- session 是基于 cookie 的

### 2.cookie 的读取

如果域中有 cookie 发起请求时会在 **Request Headers**里带上`Cookie: name=zwh; age=18`。

服务器直接去头里取即可

```js
const http = require('http');
const querystring = require('querystring');
http
  .createServer((req, res) => {
    if (req.url == '/read') {
      // 读取并把 cookie 转成对象  {name:"zwh", age:"18"}
      let cookieObj = querystring.parse(req.headers.cookie, '; ', '=');
      res.end(`cookie is: ${JSON.stringify(cookieObj)}`);
    }
  })
  .listen(3000);
```

### 3.cookie 的写入

```js
const http = require('http');
http
  .createServer((req, res) => {
    if (req.url == '/write') {
      res.setHeader('Set-Cookie', ['name=zwh', 'age=18']);
      // res.setHeader('Set-Cookie', 'name=zwh'); // 写入单个 cookie
      res.end('write ok');
    }
  })
  .listen(3000);
```

`http://localhost:3000/write`执行写入请求，**Response Headers** 可以看到 `Set-Cookie: name=zwh` `Set-Cookie: age=18`。

只有写入多个 cookie ,才需要把 cookie 放入数组里。

### 4.cookie 的其他属性

cookie 除了 key、value 还可以设置其他属性，属性之间用分号空格隔开

**域名设置**

域名访问权限控制。
比如`a.zwh.com/write`设置 cookie`name=zwh; domain=zwh.com`，`zwh.com`的子域名都可以访问，`a.zwh.com`、`b.zwh.com`。
如果不填写默认是当前的域名。

```js
res.setHeader('Set-Cookie', 'name=zwh; domain=zwh.com');
```

**有效期设置**

到时间后浏览器自动清除。可以有两种方式**max-age**相对时间和**expires**绝对时间，推荐用 max-age

```js
res.setHeader('Set-Cookie', 'name=zwh; max-age=10'); // 10秒后过期，相对时间
res.setHeader(
  'Set-Cookie',
  `name=zwh; expires=${new Date(Date.now() + 10 * 1000).toGMTString()}`,
); // 10秒后过期，绝对时间
```

**路径设置**

作用和域名设置类似，不过是更加细致化，一般使用不多。
设置 cookie`name=zwh; domain=a.zwh.com; path=/write`，只有`a.zwh.com/write`才能访问。
如果不填写默认是任意路径 /

```js
res.setHeader('Set-Cookie', 'name=zwh; domain=a.zwh.com; path=/write');
```

**httpOnly 设置**

客户端是否可以操作 cookie。

不安全，客户端还是可以手动修改

```js
res.setHeader('Set-Cookie', 'name=zwh; httpOnly=true;');
```

### 5.给 cookie 加签名

cookie 是很容易在浏览器修改的，为了浏览器设置的 cookie 和传回来的 cookie 保持一致，我们通常会给 cookie 加签名，在服务端做校验。

比如 cookie`name: zwh`在值的后面加`.签名`就是`name:zwh.mWOKTrGqIq2ihJCdOzk8BAw6BUtQg3Au2Bh1Sn2M`

用加盐算法，根据**内容**和**秘钥**算出一个签名，相同的秘钥签名的结果是相同的

> Base64 有三个字符`+`、`/`和`=`，在 URL 里面有特殊含义，通常要被替换掉：`=`被省略、`+`替换成`-`，`/`替换成`_` ，拿到后再替换回来。这里只做校验签名，置空即可

```js
const crypto = require('crypto');
const secret = 'adsadbAvhnrgreu657i76lui3r'; // 秘钥，不能泄露出去

const sign = value => {
  let str = crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('base64');
  return str.replace(/\/|\=|\+/, ''); // url中传输，"/"、"="、"+"会出现异常
};
console.log(sign('zwh'));
```

### 6.cookie 方法的封装

在 res 中拓展 getCookie 方法

```js
const http = require('http');
const querystring = require('querystring');
const crypto = require('crypto');

const secret = 'adsadbAvhnrgreu657i76lui3r'; // 秘钥，不能泄露出去
const sign = value => {
  let str = crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('base64');
  return str.replace(/\/|\=|\+/, ''); // url中传输，"/"、"="、"+"会出现异常
};

http
  .createServer((req, res) => {
    req.getCookie = function(key, options = {}) {
      let cookieObj = querystring.parse(req.headers.cookie, '; ', '=');
      if (options.signed) {
        let [value, sign] = (cookieObj[key] || '').split('.');
        let newSign = sign(value);
        if (newSign === sign) {
          return value; // 签名一致，说明 value 是没有被改过
        } else {
          return undefined; // value 被篡改了，不能使用了
        }
      }
      return cookieObj[key];
    };

    let name = req.getCookie('name', { signed: true }) || 'empty'; // 需要校验签名
    res.end(name);
  })
  .listen(3000);
```

在 res 中拓展 setCookie 方法

```js
const http = require('http');
const crypto = require('crypto');

const secret = 'adsadbAvhnrgreu657i76lui3r'; // 秘钥，不能泄露出去
const sign = value => {
  let str = crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('base64');
  return str.replace(/\/|\=|\+/, ''); // url中传输，"/"、"="、"+"会出现异常
};

http
  .createServer((req, res) => {
    let cookies = [];
    res.setCookie = function(key, value, options = {}) {
      let opts = [];
      if (options.domain) {
        opts.push(`domain=${options.domain}`);
      }
      if (options.path) {
        opts.push(`path=${options.path}`);
      }
      if (options.maxAge) {
        opts.push(`max-age=${options.maxAge}`);
      }
      if (options.httpOnly) {
        opts.push(`httpOnly=${options.httpOnly}`);
      }
      if (options.signed) {
        value = value + '.' + sign(value);
      }
      cookies.push(`${key}=${value}; ${opts.join('; ')}`);
      res.setHeader('Set-Cookie', cookies);
    };

    res.setCookie('name', 'zwh', {
      httpOnly: true,
      maxAge: 200,
      signed: true, // 启用签名
    });
    res.setCookie('age', '18');
  })
  .listen(3000);
```

### 7.session 的原理

签名解决了 cookie 会被篡改的问题，但如果 cookie 的内容还是会被看到的，假如 cookie 存的是敏感信息会有风险，我们希望 cookie 存的只是一个 id，id 对应的内容存在服务器。

比如说我们去办一张健身卡，健身卡有可以使用的次数，而健身房只会给我们一个卡号 id，下次去健身房报 id 可以查询到还剩几次次数

```js
const Koa = require('koa');
const Router = require('@koa/router');
const uuid = require('uuid');
const app = new Koa();

const session = {}; // 很多客户信息
const cardName = 'fitness.sid'; // 这是健身房的卡

router.get('/visit', async (ctx, next) => {
  let cardId = ctx.cookies.get(cardName);
  if (cardId && session[cardId]) {
    session[cardId].count--;
    ctx.body = `你有${session[cardId].count}次机会`;
  } else {
    let cardId = uuid.v4();
    session[cardId] = { count: 3 };
    ctx.cookies.set(cardName, cardId); // 可以设置 cookie 的其他参数
    ctx.body = `你有${session[cardId].count}次机会`;
  }
});

app.use(router.routes());
app.listen(3000);
```

> Koa > cookie 签名和 session 的使用
