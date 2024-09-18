# 手写 Koa 核心

koa 主要有四个文件，application.js、context.js、request.js、response.js

[手写 koa 源码](https://github.com/zwhid/example/tree/master/Node/koa-code/koa)

```js
// --------- application.js -----------

const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');
const Stream = require('stream');
const EventEmitter = require('events');

class Application extends EventEmitter {
  constructor() {
    super();
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
    this.middlewares = [];
  }
  compose(ctx) {
    let index = -1;

    const dispatch = i => {
      // 在一个函数中多次 next 会导致 i不变 index 增加，报错
      if (i <= index) return Promise.reject('next() called multiples');
      // 最后一个函数有next，i 多迭代一次
      if (i === this.middlewares.length) return Promise.resolve();

      index = i;
      const middleware = this.middlewares[i];

      try {
        return Promise.resolve(middleware(ctx, () => dispatch(i + 1)));
        // return Promise.resolve(middleware(ctx, dispatch.bind(null, i+1)))
      } catch (e) {
        return Promise.reject(e);
      }
    };
    return dispatch(0);
  }

  handleRequest(req, res) {
    const ctx = this.createContext(req, res);

    res.statusCode = 404;

    // this.fn(ctx)
    this.compose(ctx)
      .then(() => {
        const body = ctx.body; // 拿到 body 最后一次设置的值

        if (typeof body === 'string' || Buffer.isBuffer(body)) {
          res.setHeader('Content-Type', 'text/htmlcharset=utf8');
          return res.end(body);
        }

        if (body instanceof Stream) {
          res.setHeader(
            'Content-Disposition',
            `attachement;filename=${encodeURIComponent('下载')}`,
          );
          return body.pipe(res);
        }

        if (typeof body === 'object') {
          res.setHeader('Content-Type', 'application/json;charset=utf8');
          return res.end(JSON.stringify(body));
        }

        res.end('Not Found');
      })
      .catch(err => {
        this.emit('error', err);
      });
    this.on('error', () => {
      res.statusCode = 500;
      res.end('Internal Error');
    });
  }
  createContext(req, res) {
    const ctx = Object.create(this.context);
    const request = Object.create(this.request);
    const response = Object.create(this.response);

    // ctx.__proto__.__proto__ = proto
    ctx.request = request;
    ctx.response = response;
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;

    return ctx;
  }
  use(fn) {
    this.middlewares.push(fn);
  }
  listen(...args) {
    const server = http.createServer(this.handleRequest.bind(this));
    server.listen(...args);
  }
}

module.exports = Application;
```

```js
// --------- context.js -----------

const proto = {};

// 代理实现 ctx.xxx = ctx.request.xxx  ctx.xxx = ctx.response.xxx
defineGetter('request', 'path');
defineGetter('request', 'url');
defineGetter('response', 'body');
defineSetter('response', 'body');

module.exports = proto;

function defineGetter(target, key) {
  proto.__defineGetter__(key, function() {
    return this[target][key];
  });
}

function defineSetter(target, key) {
  proto.__defineSetter__(key, function(value) {
    this[target][key] = value;
  });
}
```

```js
// --------- request.js -----------

const url = require('url');
module.exports = {
  get path() {
    const { pathname } = url.parse(this.req.url);
    return pathname;
  },
  get query() {
    let { query } = url.parse(this.req.url, true);
    return query;
  },
};
```

```js
// --------- response.js -----------

module.exports = {
  _body: null,
  get body() {
    return this._body;
  },
  set body(val) {
    this.res.statusCode = 200; // 如果有设置 body 更改状态码为 200
    this._body = val;
  },
};
```
