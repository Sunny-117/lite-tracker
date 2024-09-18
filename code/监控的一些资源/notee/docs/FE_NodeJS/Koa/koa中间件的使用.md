# koa 中间件的使用

```js
const Koa = require('koa');
const app = new Koa();
const path = require('path');

const bodyParser = require('./koa-bodyparser');
const static = require('./koa-static');

// 静态文件中间件，先匹配静态服务
app.use(static(path.resolve(__dirname, 'public')));

// 用户提交的数据，可能会有文件，需要指定保存文件的路径
app.use(bodyParser(path.resolve(__dirname, 'upload')));

// 接口处理
app.use(async (ctx, next) => {
  if (ctx.path === '/login' && ctx.method == 'POST') {
    ctx.set('Content-Type', 'text/html');
    ctx.body = ctx.request.body;
  } else {
    await next();
  }
});

app.listen(3000);
```
