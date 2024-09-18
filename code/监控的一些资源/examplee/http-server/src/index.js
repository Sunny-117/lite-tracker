const http = require('http');
const fs = require('fs').promises;
const { createReadStream, readFileSync } = require('fs');
const url = require('url');
const path = require('path');
const crypto = require('crypto');
const ejs = require('ejs');
const mime = require('mime');
const chalk = require('chalk'); // 粉笔，命令行文字着色

class Server {
  constructor(config) {
    this.port = config.port;
    this.directory = config.directory;
    this.host = config.host;
    this.template = readFileSync(path.resolve(__dirname, 'template.ejs'), 'utf8');
  }

  async handleRequest(req, res) {
    let { pathname } = url.parse(req.url);
    pathname = decodeURIComponent(pathname); // 转义url中的中文
    let filePath = path.join(this.directory, pathname);
    try { // 如果路径不存在，返回 Not Found
      let statObj = await fs.stat(filePath);
      if (statObj.isFile()) { // 如果路径是文件，直接返回文件
        this.sendFile(req, res, filePath, statObj);
      } else { // 如果路径是文件夹，先尝试读取文件夹下的index.html，没有则显示文件列表
        const indexFilePath = path.join(filePath, 'index.html');
        try {
          let statObj = await fs.stat(indexFilePath);
          this.sendFile(req, res, indexFilePath, statObj);
        } catch (e) {
          this.showList(req, res, filePath, statObj, pathname);
        }
      }
    } catch (e) {
      this.sendError(req, res, e);
    }
  }
  async showList(req, res, filePath, statObj, pathname) {
    let dirs = await fs.readdir(filePath);
    try { // 如果异步渲染出错返回 Not Found
      dirs = dirs.map(item => ({
        dir: item,
        href: path.join(pathname, item) // 拼接成绝对路径
      }));
      let templateStr = await ejs.render(this.template, { dirs }, { async: true });
      res.setHeader('Content-Type', 'text/html;charset=utf-8');
      res.end(templateStr);
    } catch (e) {
      this.sendError(req, res, e);
    }
  }
  async cache(req, res, filePath, statObj) {
    res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString());
    res.setHeader('Cache-Control', 'max-age=10');

    // 指纹比对
    let fileBuffer = await fs.readFile(filePath);
    let ifNoneMatch = req.headers['if-none-match'];
    let etag = crypto.createHash('md5').update(fileBuffer).digest('base64');

    // 修改时间比对
    let ifModifiedScince = req.headers['if-modified-since'];
    let ctime = statObj.ctime.toGMTString()

    res.setHeader('Last-Modified', ctime);
    res.setHeader('Etag', etag);

    if (ifNoneMatch !== etag) {
      return false;
    }

    if (ctime !== ifModifiedScince) {
      return false
    }
    return true;
  }
  gzip(req, res) {
    // 如果浏览器能用 gzip 编码，返回 gzip 转化流，并告诉浏览器文件内容用 gzip 压缩过
    if (req.headers['accept-encoding'] && req.headers['accept-encoding'].includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip')
      return require('zlib').createGzip();
    } else {
      return false;
    }
  }
  async sendFile(req, res, filePath, statObj) {
    // 协商缓存，如果服务端文件没有修改，返回 304，浏览器去缓存取
    let cache = await this.cache(req, res, filePath, statObj);
    if (cache) {
      res.statusCode = 304;
      return res.end()
    }

    res.setHeader('Content-Type', mime.getType(filePath) + ';charset=uft-8')
    const gzip = this.gzip(req, res); // 如果有 gzip 转化流，文件流压缩后再返回
    if (gzip) {
      createReadStream(filePath).pipe(gzip).pipe(res);
    } else {
      createReadStream(filePath).pipe(res);
    }
  }
  sendError(req, res, e) {
    console.log(e);
    res.statusCode = 404;
    res.end('Not Found');
  }
  start() {
    const server = http.createServer(this.handleRequest.bind(this));
    server.listen(this.port, this.host, () => {
      console.log(`${chalk.yellow('Starting up zwh-http-server, serving')} ./${path.relative(process.cwd(), this.directory)}`);// 计算运行目录和传入目录的相对路径
      console.log(`  http://${this.host}:${chalk.green(this.port)}`);
    })
  }
}
module.exports = Server;