// 阿里日志服务使用文档：https://help.aliyun.com/document_detail/120218.html?spm=a2c4g.750001.0.i1
 
const userAgent = require('user-agent')

let host = 'cn-beijing.log.aliyuncs.com'
let project = 'monitor-demo'
let logStore = 'monitor-demo-store'

function getExtraData() {
    return {
        title: document.title,
        url: location.href,
        timestamp: Date.now(),
        userAgent: userAgent.parse(navigator.userAgent).name,
    }
}
// gif图片做上传 图片速度快没有跨域问题。但是有长度限制，只能发送get请求
class SendTracker {
    constructor() {
        this.url = `http://${project}.${host}/logstores/${logStore}/track`; // 上报路径
        this.xhr = new XMLHttpRequest;
    }
    send(data = {}) {
        console.log('send data', data)
        let extraData = getExtraData()
        let log = { ...extraData, ...data }

        // 阿里云日志服务的要求，对象的值不能是数字，因此这里处理成字符串
        for (let key in log) {
            if (typeof log[key] === 'number') {
                log[key] = `${log[key]}`
            }
        }

        this.xhr.open("POST", this.url, true);
        
        let body = JSON.stringify({"__topic__" : "topic", "__source__" : "source", "__logs__" : [log],"__tags__" : {} })

        this.xhr.setRequestHeader('Content-Type', 'application/json')
        // api要求的请求头
        this.xhr.setRequestHeader('x-log-apiversion', '0.6.0') // 版本号
        this.xhr.setRequestHeader('x-log-bodyrawsize', body.length) // 请求体大小

        this.xhr.onload = function () {
            console.log(this.xhr);
        }
        this.xhr.error = function (error) {
            console.log(error);
        }

        this.xhr.send(body)
    }
}

export default new SendTracker()