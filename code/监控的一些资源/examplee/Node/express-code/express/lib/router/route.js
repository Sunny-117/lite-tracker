const Layer = require('./layer')
const methods = require('methods');
function Route() {
    this.stack = [];
    this.methods = {}; // 用来标记内部存过哪些方法
}
Route.prototype.dispatch = function (req, res, out) { // out 相当于 router.next，调用后或者没匹配到都调下一个
    let idx = 0;
    const next = (err) => {
        err && out(err); /// 如果迭代的时候遇到有next('err')，直接到外层的 stack 中
        if (idx >= this.stack.length) return out();
        let layer = this.stack[idx++];
        if (layer.method === req.method.toLowerCase()) {
            layer.handle_request(req, res, next);
        } else {
            next();
        }
    }
    next();
}
methods.forEach(method => {
    Route.prototype[method] = function (handlers) {
        if (!Array.isArray(handlers)) {
            handlers = [handlers];
        }
        handlers.forEach((handler) => {
            let layer = new Layer('', handler); // 路径没有意义
            layer.method = method; // layer 存的方法

            this.methods[method] = true; // 加速匹配优化，{post:true, get:true}
            this.stack.push(layer);
        })
    }
});

module.exports = Route;