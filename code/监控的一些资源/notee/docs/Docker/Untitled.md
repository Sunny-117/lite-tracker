### Docker 架构

我们要使用 Docker 来操作镜像、容器，就必须要安装 Docker。

Docker 是一个 CS 架构的程序，由两部分组成：

- 服务端(server)：Docker 守护进程，负责处理 Docker 指令，管理镜像、容器等

- 客户端(client)：通过命令或 RestAPI 向 Docker 服务端发送指令。可以在本地或远程向服务端发送指令。

![image-20210731154257653](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-24-BG8oJI.png)

###

192.168.211.2

```bash
/Library/Preferences/VMware Fusion

vim networking
```

docker save -o [打包名.tar][镜像名]:[镜像版本]

```bash
docker save -o nginx2.tar nginx:latest
```

```bash
docker load --input fedora.tar
```

rabbitmq-plugins enable rabbitmq_delayed_message_exchange

```bash
apt-get update
apt-get install -y vim
```

```bash
docker run --name nginx2 -v html:/usr/share/nginx/html -p 80:80 -d nginx
```

> 宿主机没有 html 数据卷会自动创建，有则和容器目录挂载
>
> 容器没有/usr/share/nginx/html 则自动创建该目录，有则自动和宿主目录挂载

```dockerfile
# 指定基础镜像
FROM ubuntu:16.04

# 配置环境变量，JDK的安装目录
ENV JAVA_DIR=/usr/local

# 拷贝jdk安装包到JDK安装目录
# 拷贝java项目到/tmp目录并改名
COPY ./jdk8.tar.gz $JAVA_DIR/
COPY ./docker-demo.jar /tmp/app.jar

# 进入JDK安装目录，解压安装包，重命名
RUN cd $JAVA_DIR \
 && tar -xf ./jdk8.tar.gz \
 && mv ./jdk1.8.0_144 ./java8

# 配置环境变量
ENV JAVA_HOME=$JAVA_DIR/java8
ENV PATH=$PATH:$JAVA_HOME/bin

# 暴露端口
EXPOSE 8090

# 入口，java项目的启动命令
ENTRYPOINT java -jar /tmp/app.jar
```
