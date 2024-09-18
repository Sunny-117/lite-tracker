# jwt 原理

### 1.什么是 jwt？

JSON Web Token（JWT）是目前最流行的跨域身份验证解决方案。
解决问题：session 不支持分布式架构，无法支持横向扩展，只能通过数据库来保存会话数据实现共享。如果持久层失败会出现认证失败。
优点：服务器不保存任何会话数据，即服务器变为无状态，使其更容易扩展。

#### JWT 包含三部分（用.分隔开）

**Header 头部**

```js
{ typ: 'JWT', alg: 'HS256' }
```

**Payload 负载、载荷**

payload 能被反解，不能放敏感信息

```js
// JWT 规定了7个官方字段
iss (issuer)：签发人
exp (expiration time)：过期时间
sub (subject)：主题
aud (audience)：受众
nbf (Not Before)：生效时间
iat (Issued At)：签发时间
jti (JWT ID)：编号
```

**Signature 签名**

对 Header 和 Payload 的签名，防止数据篡改

```js
sha256(header + '.' + payload, secret);
```

### 2.jwt 的应用方法

以 koa 举例，其他框架方式一致

- jwt.encode() 传入加密的数据和 secret，就能生成 token
- jwt.decode() 传入客户端发过来 token 和 secret，如果签名校验不通过会报错

```js
const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('jwt-simple');
const router = new Router();
const app = new Koa();

const secret = 'adsadbAvhnrgreu657i76lui3r'; // 秘钥

router.get('/login', async ctx => {
  // login时，生成一个 token，返回给客户端
  let token = jwt.encode(
    {
      username: 'admin',
      expires: '100',
    },
    secret,
  );
  ctx.body = {
    token,
  };
});

router.get('/validate', async ctx => {
  let authorization = ctx.headers['authorization'];
  if (authorization) {
    let r = {};
    try {
      r = jwt.decode(authorization, secret); // token 校验通过
    } catch (e) {
      r.messag = '令牌失效 ';
    }
    ctx.body = {
      ...r,
    };
  }
});

app.use(router.routes());
app.listen(3000);
```

### 3.原理实现

**jwt.encode() 步骤**

1. 把固定的 header 和 用户传入的 payload 转成 base64
2. header 和 payload 用 `.` 相连，用 sha256 加密得到 sign
3. header、payload、sign 用 `.` 相连就是 token 了

**jwt.decode() 步骤**

1. token 用 `.` 分割就是 header、payload、sign
2. header 和 payload 用 `.` 相连，用 sha256 重新加密得到 newSign，如果和 sign 相同则 payload 没有被修改过，校验通过
3. payload 补回被替换过的 base64 符号，现在 payload 是 base64 文件
4. 用 Buffer 把 base64 转成二进制后再转成字符串，最后还原回对象

> JWT 作为一个令牌（token），有些场合可能会放到 URL（比如 api.example.com/?token=xxx），Base64 有三个字符`+`、`/`和`=`，在 URL 里面有特殊含义。toBase64Url()要替换掉：`=`被省略、`+`替换成`-`，`/`替换成`_` 。base64urlUnescape() 要还原回来。

```js
const jwt = {
  toBase64Url(content) {
    return content
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  },
  toBase64(content) {
    return this.toBase64Url(
      Buffer.from(JSON.stringify(content)).toString('base64'),
    );
  },
  sign(content, secret) {
    return this.toBase64Url(
      crypto
        .createHmac('sha256', secret)
        .update(content)
        .digest('base64'),
    );
  },
  base64urlUnescape(str) {
    str += new Array(5 - (str.length % 4)).join('=');
    return str.replace(/\-/g, '+').replace(/_/g, '/');
  },
  encode(payload, secret) {
    // 加密方法
    payload = this.toBase64(payload);
    let header = this.toBase64({ typ: 'JWT', alg: 'HS256' });
    let sign = this.sign(header + '.' + payload, secret);
    return header + '.' + payload + '.' + sign;
  },
  decode(token, secert) {
    // 解密方法
    let [header, payload, sign] = token.split('.');
    let newSign = this.sign(header + '.' + payload, secret);
    if (sign === newSign) {
      // token 的 header 和 payload，重新加密后生成的 newSign 和 sign 比对
      return JSON.parse(
        Buffer.from(this.base64urlUnescape(payload), 'base64').toString(),
      );
    } else {
      throw new Error('令牌错误');
    }
  },
};
```
