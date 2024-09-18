# file-loader 和 url-loader

## file-loader

**file-loader**在打包时会做 3 件事：

1. 随机生成一个 hash 值，或者用指定的文件名
2. 将图片拷贝到输出目录的静态资源文件夹下
3. 将打包后的图片名称返回给 require 函数

### 安装和使用

```bash
npm i file-loader -D
```

```js
module.exports = {
  // 先去根目录的node_modules找，如果没有，去./loaders找加载器
  resolveLoader: {
    modules: ['node_modules', path.join(__dirname, 'loaders')],
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|bmp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              filename: '[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

```js
//  ------- index.js ---------- //
let url = require('./logo.png');
console.log(url);
let img = new Image();
img.src = url;
document.body.appendChild(img);
```

### file-loader 源码

##### ./loaders/file-loader.js

```js
let { getOptions, interpolateName } = require('loader-utils'); // 可以用自带工具箱，也可以自己手写

function loader(content) {
  let options = getOptions(this) || {}; // 得到配置对象

  let filename = interpolateName(this, options.filename, { content }); // 用指定的文件名或者根据内容生成一个md5做为文件名

  this.emitFile(filename, content); // 向输出目录写入文件，调用emitFile方法
  return `module.exports = ${JSON.stringify(filename)}`;
}

loader.raw = true; // raw原生的，告诉webpack需要是的 Buffer，而非字符串
module.exports = loader;

function interpolateName(loaderContext, name, options) {
  let filename = name || '[hash].[ext]';
  let ext = path.extname(loaderContext.resourcePath).slice(1);
  let hash = require('crypto')
    .createHash('md5')
    .update(options.content)
    .digest('hex');
  filename = filename.replace(/\[hash\]/gi, hash).replace(/\[ext\]/gi, ext);
  return filename;
}

function getOptions(loaderContext) {
  const query = loaderContext.query;
  if (typeof query === 'string' && query !== '') {
    return parseQuery(loaderContext.query);
  }
  if (!query || typeof query !== 'object') {
    return null;
  }
  return query;
}

function parseQuery(query) {
  // name=zwh&age=18
  return query.split('&').reduce((memo, item) => {
    let [key, value] = item.split('=');
    memo[key] = value;
    return memo;
  }, {});
}
```

## url-loader

**url-loader**是在**file-loader**基础上封装的，在打包时会做 3 件事：

1. 得到 limit，转成数字
2. 根据路径得到图片的 Content-Type
3. 如果没有设定或者图片小于指定的 limit，则把图片转成 base64，返回 base64。否则用 file-loader 加载，返回图片名称

### 安装和使用

```bash
npm i url-loader -D
```

```js
module.exports = {
  // 先去根目录的node_modules找，如果没有，去./loaders找加载器
  resolveLoader: {
    modules: ['node_modules', path.join(__dirname, 'loaders')],
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|bmp)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
            },
          },
        ],
      },
    ],
  },
};
```

```js
//  ------- index.js ---------- //
let url = require('./logo.png');
console.log(url);
let img = new Image();
img.src = url;
document.body.appendChild(img);
```

### url-loader 源码

##### ./loaders/url-loader.js

```js
let path = require('path');
let mime = require('mime'); // 通过文件名获取文件的Content-Type，logo.png => image/png
let { getOptions } = require('loader-utils');

function loader(content) {
  let options = getOptions(this) || {};
  let { limit, fallback = 'file-loader' } = options;
  if (limit) {
    // 字符串转成数字
    limit = parseInt(limit, 10);
  }
  const mimeType = mime.getType(this.resourcePath); // logo.png => image/png

  // 如果没有设定或者图片小于指定的 limit，则把图片转成 base64，否则用 file-loader 加载
  if (!limit || content.length < limit) {
    let base64String = `data:${mimeType};base64,${content.toString('base64')}`;
    return `module.exports = ${JSON.stringify(base64String)}`;
    // return `export default ${JSON.stringify(base64String)}`;
  } else {
    let fileLoader = require(fallback || 'file-loader');
    return fileLoader.call(this, content);
  }
}

loader.raw = true; // raw原生的，告诉webpack需要是的 Buffer，而非字符串
module.exports = loader;
```
