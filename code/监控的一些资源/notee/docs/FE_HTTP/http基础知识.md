# http 基础知识

### 什么是 HTTP

通常的网络是在 TCP/IP 协议族的基础上来运作的，HTTP 是一个子集。

### 协议分层(OSI 协议分层)

(物，数)，网，传，(会，表，应)

- 应用层 HTTP,FTP,DNS (与其他计算机进行通讯的一个应用服务，向用户提供应用服务时的通信活动)
- 传输层 TCP（可靠） UDP 数据传输 (HTTP -> TCP DNS->UDP)
- 网络层 IP 选择传输路线 (通过 ip 地址和 mac 地址)(使用 ARP 协议凭借 mac 地址进行通信)
- 链路层 网络连接的硬件部分

![img](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/19-14-45-ZjoSlh.png)

### HTTP 特点

- http 是不保存状态的协议，使用 cookie 来管理状态 (登录 先给你 cookie 我可以看一下你有没有 cookie)
- 为了防止每次请求都会造成无谓的 tcp 链接建立和断开，所以采用保持链接的方式 keep-alive
- 以前发送请求后需要等待并收到响应，才能发下一个，现在都是管线化的方式 (js css 可以并发请求 6 个) cdn

### HTTP 缺点

通信采用明文

不验证通信方的身份

无法验证内容的完整性 (内容可能被篡改)

> 通过 SSL（安全套阶层）建立安全通信线路 HTTPS (超文本传输安全协议)

### http 通信内容

![img](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/19-15-05-tljK7u.png)

![img](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/19-14-56-2W7KTs.png)

![img](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/19-15-13-en6YoW.png)

### HTTP 方法

#### Restful 风格

- get 查询
- post 增加
- put 修改
- delete 删除

#### 简单请求

- 只要请求方法不是 head、get、post，都是复杂请求
- 只要设置了自定义头，都是复杂请求

#### options 请求

options 预检请求需要满足两个条件才会触发

1. 跨域了
2. 是复杂请求

## 常用的状态码

\- 1xx websocket

\- 2xx 200 成功，204(响应体为空)，206(范围请求)

\- 3xx 304 缓存，301(永久重定向)， 302(临时重定向)， 307 (重定向，pc、移动端)

\- 4xx 400 请求出错，401 没权限，403 登录权限不够，404 找不到，405 方法不允许

\- 5xx 500 服务端出错，502 503 504 ng 相关
