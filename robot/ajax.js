
/**
 *  ajax: async javascript and xml（json）(代表着一种数据结构) 
 *  同步：一行一行执行 按顺序执行 如果前面出现问题了  后面的代码不会执行（阻碍后续代码的执行）
 *  异步：可以同时执行
 *  XMLHTTPRequest 
 *  ajax: 应用： 前端页面和后台进行数据交互的一种方案
 *  
 *  问问题：
 *  1. 明确问谁  （url地址）
 *  2. 明确以哪种方式传递数据  （请求方式type）
 *  3. 明确问问题的条件        （请求参数data）
 *  4. 对方的答案给到我之后的处理  （成功的回调函数success）
 *  5. 对方没有给予正常的回答的处理  （失败的回调函数 error）
 */
function ajax(options) {
    // 请求的服务器地址
    var url = options.url || '';
    // 请求方式
    var type = options.type.toUpperCase() || 'GET';
    // 请求参数   字符串 key=value&key1=value1
    var data = options.data || '';
    // 成功的回调函数
    var success = options.success || function () {};
    // 失败的回调函数
    var error = options.error || function () {};
    // 当前请求是否异步
    var async = typeof options.async == 'boolean' ? options.async : true;
    // 请求拦截函数  如果返回false 则不发出网络请求  否则发出
    var beforeSend = options.beforeSend || function (xhr) {return xhr};
    // 存储整个网络请求的所有信息对象
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    } else {
        return alert('当前浏览器不支持XMLHTTPRequest');
    }
    // xhr.readyState  0 - 4
    // 0    建立连接之前
    // 1    建立连接 调用open方法了
    // 2    open调用完了  等待发送数据
    // 3    正在发送和接收数据
    // 4    整个请求已经完成  对方已经给予回应
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4) {
            if (xhr.status === 200) {
                success(JSON.parse(xhr.responseText));
            }
        }
    }
    // 监听到错误之后 调用error回调函数
    xhr.onerror = function (err) {
        error(new Error(err));
    }
    if (!beforeSend(xhr)) {
        return false;
    }
    if (type === 'GET') {
        // 建立连接
        xhr.open(type, url + '?' + data, async);
        xhr.send();
    } else {
        // 建立连接
        xhr.open(type, url, async); 
        // 设置编码类型  （编码类型指代的是 传递过程当中数据的格式  后台在接收到这个请求的时候 应该以什么格式解析）
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // 发出数据
        xhr.send(data);
    }
    

}