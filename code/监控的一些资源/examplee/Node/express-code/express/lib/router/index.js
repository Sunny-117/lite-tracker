const url = require('url');
const Layer = require('./layer');
const Route = require('./route');
const methods = require('methods'); // get、post 等方法列表

function Router() { // new 的特点 当new一个函数时 这个函数返回一个引用类型，那么这个引用类型会作为this
    let router = (req, res, next) => {
        // 绑定二级路由时，app.use('/user', router) 等于 app.use('/user', handle)
        // 所以匹配到二级路由时，会运行这里
        router.handle(req, res, next); // 处理二级路由请求
    }
    router.stack = [];
    router.__proto__ = proto; // 路由的实例可以通过链 找到 原来的方法
    return router; // 有router.get、post方法
}


let proto = {}
proto.route = function (path) { // router.get() 的 this 是 proto
    let route = new Route();
        // 1.调用get时，产生一个 Layer 实例和 Route 实例，并进行关联
        // 2.将 route 的dsiaptch 方法存到 layer 上，类似于观察者模式
        // 3.layer 放到栈中
        // 4.返回 route 容器，供添加处理函数
    let layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route; // 每个 app.get()，route.get() 都有一个 route 实例，里面放着 多个处理函数
    this.stack.push(layer);
    return route;
}
methods.forEach(method => {
    proto[method] = function (path, handlers) {
        // 调用 app.get() 时，产生一个 Layer 实例和 Route 实例，并进行关联
        let route = this.route(path);
        route[method](handlers); // 调用 get 方法时，传入的 handler 可能有多个，按照方法分别放进不同栈中
    }
})

proto.use = function (path, ...handlers) {
    if (typeof path == 'function') {  // 如果第一个参数是函数，则没有传路径，path 设为 / 
        handlers.unshift(path);
        path = '/';
    }
    for (let i = 0; i < handlers.length; i++) { // 可能有多个函数，循环添加层
        let layer = new Layer(path, handlers[i]);
        layer.route = undefined; // 这是中间件，标记没有 route 路径 
        this.stack.push(layer);
    }
}

// 遍历外层 layer 和里层 layer，外层 layer 匹配 方法和路径，里层 layer 只匹配路径
proto.handle = function (req, res, out) {
    let { pathname } = url.parse(req.url); // 前端请求路径
    let idx = 0;
    let removed = '';
    let next = (err) => {
        if (idx >= this.stack.length) return out(); // 遍历完后还是没找到，就直接跳出路由系统
        let layer = this.stack[idx++];
        if (removed) {
            req.url = removed + pathname;// 匹配二级路径中修改的路径，还原回去，出来后要匹配其他的中间件
            removed = '';
        }
        if (err) { // 如果发现有抛出的错误，需要处理
            if (!layer.route) {
                layer.handle_error(err, req, res, next); // 如果是中间件，内部自己判断是否为错误处理中间件
            } else {
                next(err); // 路由系统则跳过，继续携带错误向下执行，直到找到错误处理中间件
            }
        } else {
            // 1.layer 内部判断请求路径是否一致
            // 2.1.如果一致，普通中间件去匹配二级路径，错误中间件跳过
            // 2.2.如果一致，路由系统(或 route 容器)调用 dispatch 方法
            if (layer.match(pathname)) {
                if (!layer.route) { // 这是普通中间件
                    if (layer.handler.length !== 4) {
                        if (layer.path !== '/') {
                            removed = layer.path;
                            req.url = pathname.slice(removed.length); // 截掉匹配成功后的一级路径
                        }
                        layer.handle_request(req, res, next);
                    } else {
                        next(); // 这是错误中间件
                    }
                } else { // 这是 路由系统(或 route 容器)
                    if (layer.route.methods[req.method.toLowerCase()]) { // 加速匹配优化， 路由系统的方法都存在 methods 里
                        layer.handle_request(req, res, next); // 将遍历路由系统中下一层的方法传入
                    } else {
                        next();
                    }
                }
            } else {
                next();
            }
        }

    }
    next();
}
module.exports = Router;


