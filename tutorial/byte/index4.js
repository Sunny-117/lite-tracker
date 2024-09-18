var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// 1. 写一个简易的 hook 函数
function hookMethod(obj, key, hookFunc) {
    return function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        obj[key] = hookFunc.apply(void 0, __spreadArray([obj[key]], params, false));
    };
}
// 2. hook xhr 对象的 open 方法拿到请求地址和方法
hookMethod(XMLHttpRequest.prototype, 'open', function (origin) {
    return function (method, url) {
        this.payload = {
            method: method,
            url: url
        };
        // 执行原函数
        origin.apply(this, [method, url]);
    };
})();
// 3. hook xhr 对象的 send 方法监听到错误的请求
hookMethod(XMLHttpRequest.prototype, 'send', function (origin) {
    return function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        this.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status >= 400) {
                this.payload.status = this.status;
                console.log(this.payload);
            }
        });
        origin.apply(this, params);
    };
})();
var xhr = new XMLHttpRequest();
xhr.open("post", "111.cc");
xhr.send();
// 4, 封装成一个 monitor
function createXhrMonitor(report) {
    var name = "xhr-error";
    function hookMethod(obj, key, hookFunc) {
        return function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            obj[key] = hookFunc.apply(void 0, __spreadArray([obj[key]], params, false));
        };
    }
    function start() {
        hookMethod(XMLHttpRequest.prototype, 'open', function (origin) {
            return function (method, url) {
                this.payload = {
                    method: method,
                    url: url
                };
                origin.apply(this, [method, url]);
            };
        })();
        hookMethod(XMLHttpRequest.prototype, 'send', function (origin) {
            return function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                this.addEventListener("readystatechange", function () {
                    if (this.readyState === 4 && this.status >= 400) {
                        this.payload.status = this.status;
                        report({ name: name, data: this.payload });
                    }
                });
                origin.apply.apply(origin, __spreadArray([this], params, false));
            };
        })();
    }
    return { name: name, start: start };
}
