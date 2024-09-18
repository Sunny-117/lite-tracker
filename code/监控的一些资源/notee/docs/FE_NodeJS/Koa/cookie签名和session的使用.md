# cookie 签名和 session 的使用

> cookie、签名、session 的原理详见 HTTP > cookie 和 session

### 1. koa 中给 cookie 加签名

1. 在**app.keys**中声明秘钥
2. **ctx.cookies.set**设置 cookie 时，开启签名即可

```js
const Koa = require('koa');
const Router = require('@koa/router');
const app = new Koa();
const crypto = require('crypto');

let router = new Router();
app.keys = ['adsadbAvhnrgreu657i76lui3r']; // 秘钥，不能泄露出去

router.get('/visit', async (ctx, next) => {
  let visit = ctx.cookies.get('visit', { signed: true }) || 0;
  visit++;
  ctx.cookies.set('visit', `${visit}`, { httpOnly: true, signed: true });
  ctx.body = `你当前第${visit}次访问我`;
});

app.use(router.routes());
app.listen(3000);
```

签名后会有两个 cookie，一个是自己设置的 **visit**，一个是值和秘钥算出来的签名**visit.sig**
<img src="/Users/study/Library/Application Support/typora-user-images/image-20201017175346380.png" alt="image-20201017175346380" style="zoom:50%;" />

koa 中的签名是用 sha1 加密算法，加密为内容`key=value`。测试如下

```js
const crypto = require('crypto');
const secret = 'adsadbAvhnrgreu657i76lui3r'; // 秘钥

const sig = crypto
  .createHmac('sha1', secret)
  .update('visit=3')
  .digest('base64');
console.log(sig);
// 5ejCyPuaoGXg6uV4F60XSdO2dBw
```

### 2.koa 中 session

1. 导入 **koa-session** 包
2. 使用 session 并传入秘钥、和配置 cookie 参数，默认参数传空对象
3. **ctx.session**就可以直接挂载变量了

_注意：服务器重启后 session 不会保存_

```js
const Koa = require('koa');
const Koa = require('koa');
const Router = require('@koa/router');
const app = new Koa();
let router = new Router();
const session = require('koa-session');

app.keys = ['adsadbAvhnrgreu657i76lui3r']; // 秘钥，不能泄露出去

app.use(
  session(
    {
      maxAge: 10 * 1000, // 不同于原生，这里单位是毫秒
    },
    app,
  ),
);

router.get('/visit', async (ctx, next) => {
  let visit = ctx.session.visit || 0;
  visit++;
  ctx.session.visit = visit;
  ctx.body = `你当前第${visit}次访问我`;
});

app.use(router.routes());
app.listen(3000);
```

koa 里的 session，已经是自动有加签名的
<img src="/Users/study/Library/Application Support/typora-user-images/image-20201017181611652.png" alt="image-20201017181611652" style="zoom:50%;" />
