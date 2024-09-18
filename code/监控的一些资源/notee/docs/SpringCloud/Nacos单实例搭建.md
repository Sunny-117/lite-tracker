# Nacos 单实例搭建

Mac 平台和 linux 平台安装 Nacos 服务器完全一致

在 standalone 模式下,Nacos 默认使用 derby 数据库来存储配置信息。

在 Nacos_PATH/data 目录,有一个 derby-data 的文件, Derby 是 Java 编写的数据库,是 Apache 的开源项目,默认的所有配置就是存在 derby 这个数据库中。

### 下载 Nacos 安装包

在 Nacos 的 GitHub 页面，提供有下载链接，可以下载编译好的 Nacos 服务端或者源代码：

GitHub 主页：https://github.com/alibaba/nacos

GitHub 的 Release 下载页：https://github.com/alibaba/nacos/releases

> 这里`nacos-server-1.4.1.zip`为例

![image-20220527201351364](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-27-D7ijiF.png)

### 解压目录

将安装包解压到任意非中文目录下

- bin：启动脚本
- conf：配置文件

> /Users/zwh/nacos

### 启动服务

进入 bin 目录，执行运行启动脚本 `./startup.sh`

```bash
cd /Users/zwh/nacos/bin

# 默认按照集群模式启动
./startup.sh

# 传入参数，按照单例模式启动
./startup.sh -m standalone
```

停止服务

```bash
./shutdown.sh
```

### 登录控制台

http://localhost:8848/nacos

### 端口配置

Nacos 的默认端口是 8848，如果需要配置端口，修改文件`/Users/zwh/nacos/conf/application.properties`
