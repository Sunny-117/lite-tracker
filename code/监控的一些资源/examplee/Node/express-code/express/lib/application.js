const http = require('http');
const Router = require('./router');
const methods = require('methods'); // get、post 等方法列表


function Application() { }
Application.prototype.lazy_route = function () { // 路由懒加载，调用此方法才创建路由
    if (!this._router) {
        this._router = new Router();
    }
}

methods.forEach((method) => { // app.get() app.post()
    Application.prototype[method] = function (path, ...handlers) {
        this.lazy_route();
        this._router[method](path, handlers);
    }
})
Application.prototype.use = function () { // use 绑定中间件或子路由
    this.lazy_route();
    this._router.use(...arguments);
}
Application.prototype.listen = function () {
    const server = http.createServer((req, res) => {
        function done() { // 如果所有路径都没有匹配到，运行这个函数
            res.end(`Cannot ${req.method} ${req.url}`);
        }
        this.lazy_route();
        this._router.handle(req, res, done);
    });
    server.listen(...arguments)
}
module.exports = Application;