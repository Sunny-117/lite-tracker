import getLastEvent from "../utils/getLastEvent"
import getSelector from "../utils/getSelector"
import tracker from "../utils/tracker"
import getEventPath from "../utils/getEventPath";

export function injectJsError() {
    //监听全局未捕获的错误
    window.addEventListener('error', function (event) {
        console.log(event);
        let lastEvent = getLastEvent(); // 获取最后一个交互事件
        console.log({event, lastEvent}, 'eventlastEvent')
        if (event.target && (event.target.src || event.target.href)) {
            tracker.send({
                kind: 'stability', // 监控指标的大类
                type: 'error', // 小类，这是一个错误
                errorType: 'resourceError', // js、css文件资源加载出错
                filename: event.target.src || event.target.href, // 报错文件
                tagName: event.target.tagName,
                selector: getSelector(event.target)
            })
        } else {
            tracker.send({
                kind: 'stability', // 监控指标的大类
                type: 'error', // 小类，这是一个错误
                errorType: 'jsError', // JS错误
                message: event.message, // 报错信息
                filename: event.filename, // 报错文件
                position: `${event.lineno}:${event.colno}`,
                stack: getLines(event.error.stack),
                selector: lastEvent ? getSelector(getEventPath(lastEvent)) : '', // 代表最后一个操作的元素
            })
        }
    }, true);

    window.addEventListener('unhandledrejection', function (event) {
        console.log(event)
        let lastEvent = getLastEvent();
        console.log(lastEvent)
        let message;
        let filename;
        let line = 0;
        let column = 0;
        let stack = '';
        const reason = event.reason
        if (typeof reason === 'string') {
            message = reason;
        } else if (typeof reason === 'object') {
            if (reason.stack) {
                let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
                filename = matchResult[1]
                line = matchResult[2]
                column = matchResult[3]
            }
            message = reason.stack.message
            stack = getLines(reason.stack)
        }
        tracker.send({
            kind: 'stability', // 监控指标的大类
            type: 'error', // 小类，这是一个错误
            errorType: 'promiseError', // JS错误
            message: message, // 报错信息
            filename: filename, // 报错文件
            position: `${line}:${column}`,
            stack: stack,
            selector: lastEvent ? getSelector(getEventPath(lastEvent)) : '', // 代表最后一个操作的元素
        })
    }, true)

    function getLines(stack) {
        return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, "")).join("^")
    }
}