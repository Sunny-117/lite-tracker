# 解决 npm 包外网下载

## 设置全局淘宝镜像源

```bash
# 设置淘宝镜像源
npm config set registry https://registry.npm.taobao.org
```

```bash
# 查看已设置源
npm config get registry
```

## 针对个别依赖

设置了全局镜像源可能还是不能满足下载一些特定依赖包，比如：`node-sass`、`puppeteer`、`chromedriver`、`electron` 等。这时候我们配置`.npmrc`文件。

### 添加到项目

可以在项目中新建 `.npmrc` 文件设置具体依赖包的国内镜像。该文件在项目 `npm install` 时会被加载读取，优先级高于 `npm` 全局设置。

```js
registry=https://registry.npm.taobao.org/
sass_binary_site=http://npm.taobao.org/mirrors/node-sass
chromedriver_cdnurl=http://npm.taobao.org/mirrors/chromedriver
electron_mirror=http://npm.taobao.org/mirrors/electron/
puppeteer_download_host=http://npm.taobao.org/mirrors/chromium-browser-snapshots/
```

### 添加到全局

```bash
vi ~/.npmrc

# 或

npm config edit
```

```js
registry=https://registry.npm.taobao.org/
sass_binary_site=http://npm.taobao.org/mirrors/node-sass
chromedriver_cdnurl=http://npm.taobao.org/mirrors/chromedriver
electron_mirror=http://npm.taobao.org/mirrors/electron/
puppeteer_download_host=http://npm.taobao.org/mirrors/chromium-browser-snapshots/
```

esc => wq 保存退出

### 其他

```bash
# Linux & Mac
$ env ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/ npm install

# Windows
$ set ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/
$ npm install
```
