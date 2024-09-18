function Layer(path, handler) {
    this.path = path;
    this.handler = handler;
}
Layer.prototype.handle_error = function (err, req, res, next) {
    if (this.handler.length === 4) { // 错误处理中间件是4个参数，找到并调用
        return this.handler(err, req, res, next);
    }
    next(err); // 普通的中间件
}
Layer.prototype.match = function (pathname) {
    if (this.path === pathname) {
        return true;
    }
    if (!this.route) { // 这是中间件
        if (this.path == '/') {
            return true;
        }
        return pathname.startsWith(this.path + '/'); // 二级路由，请求路径 /a/b 要匹配 /a/
    }
    return false
}
Layer.prototype.handle_request = function (req, res, next) {
    this.handler(req, res, next); // 调用 dispatch 或最终的处理函数 (req,res,next)={}
}
module.exports = Layer;