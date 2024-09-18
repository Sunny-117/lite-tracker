import tracker from "../utils/tracker";

// 对XMLHttpRequest进行一个拦截处理，获取记录日志
export function injectXHR() {
    let XMLHttpRequest = window.XMLHttpRequest;
    let oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async) {
        console.log(method, url, async)
        // 上报日志本身的请求不要监控
        if (!url?.match(/logstores/) && !url.match(/sockjs/)) {
            this.logData = { method, url, async }
        }
        return oldOpen.apply(this, arguments)
    }
    let oldSend = XMLHttpRequest.prototype.send
    // TODO：fetch怎么监听
    XMLHttpRequest.prototype.send = function (body) {
        if (this.logData) {
            let startTime = Date.now() // 记录开始事件

            let handler = (type) => (event) => {
                let duration = Date.now() - startTime;
                let status = this.status;
                let statusText = this.statusText;

                tracker.send({
                    kind: 'stability',
                    type: 'xhr',
                    eventType: type,
                    pathname: this.logData.url, // 请求路径
                    status: status + '-' + statusText, // 状态码
                    duration, // 持续时间
                    response: this.response ? JSON.stringify(this.response) : '', // 响应体
                    params: body || ''
                })
            }

            this.addEventListener('load', handler('load'), false);
            this.addEventListener('error', handler('error'), false);
            this.addEventListener('abort', handler('abort'), false);
        }

        return oldSend.apply(this, arguments)
    }
}