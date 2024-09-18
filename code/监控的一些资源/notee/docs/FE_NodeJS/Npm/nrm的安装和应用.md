# nrm 的安装和应用

## 1.什么是 nrm

nrm 是一个 npm 源管理器，允许你快速在 npm 源之间进行切换。

> 我们最初是用下面方法获取和设置 npm 源
> `npm get registry` 获取当前使用的 npm 源
> `npm set registry https://registry.npm.taobao.org/` 设置 npm 源
> 但平时为了提高下载包的速度需要切换 taobao 源，为了发布包需要切换 npm 源，在公司又需要切换公司源，非常麻烦。

## 2.nrm 的安装

安装 nrm 非常简单，用 npm 全局安装就行。

```bash
npm install nrm -g
```

## 3.nrm 的常用命令

nrm 的用法也非常简单，常用命令只有两个

```bash
# 查看可选源（带*号的为当前源）
nrm ls

# 切换源（taobao为源名）
nrm use taobao
```

![屏幕快照 2021-01-03 上午10.22.36](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/10-23-44-yTSXz7.png)

## 4.nrm 的其他命令

```bash
# 添加源（registry为自定义源名，url为源地址）
# 如 nrm add company http://192.168.28.11:4873/
nrm add <registry> <url>

# 添加源
nrm del <registry>

# 测试源的响应时间
nrm test <registry>

# 查看当前使用源
nrm current
```

![屏幕快照 2021-01-03 上午10.35.37](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/10-37-26-Ejy06s.png)
