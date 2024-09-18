# 编写 webpack 插件

[compiler 钩子文档](https://webpack.docschina.org/api/compiler-hooks/#hooks)

[compilation 钩子文档](https://webpack.docschina.org/api/compilation-hooks/)

## ZipPlugin 插件

每次打包时，把资源文件打包成 zip 文件留存备份

```js
const { RawSource } = require('webpack-sources');
const JSZip = require('jszip');
const path = require('path');
class ZipPlugin {
  constructor(options) {
    this.options = options || { filename: new Date().getTime() }; // 如果没有传文件名则用时间戳
  }
  apply(compiler) {
    let that = this;
    // emit钩子在输出assets到output目录之前执行。异步钩子，结束要调callback
    compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
      var zip = new JSZip();
      for (let filename in compilation.assets) {
        // compilation.assets存放着所有产出资源，{名字: 资源}
        const source = compilation.assets[filename].source(); // 调用source得到文件内容
        zip.file(filename, source);
      }
      zip.generateAsync({ type: 'nodebuffer' }).then(content => {
        compilation.assets[that.options.filename] = new RawSource(content);
        callback();
      });
    });
  }
}
module.exports = ZipPlugin;
```

##### 使用 zipPlugin

```js
const zipPlugin = require('./plugin/zipPlugin');
plugins: [
  new zipPlugin({
    filename: 'assets.zip',
  }),
];
```
