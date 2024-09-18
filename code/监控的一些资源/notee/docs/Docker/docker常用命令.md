# docker 常用命令

## 镜像操作

#### 镜像名称

首先来看下镜像的名称组成：

- 镜名称一般分两部分组成：[repository]:[tag]。
- 在没有指定 tag 时，默认是 latest，代表最新版本的镜像

![image-20210731155141362](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-ud4Lnp.png)

这里的 mysql 就是 repository，5.7 就是 tag，合一起就是镜像名称，代表 5.7 版本的 MySQL 镜像。

#### 镜像命令

常见的镜像操作命令如图：

![image-20210731155649535](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-RYOAwO.png)

##### 查看所有镜像

```bash
docker images
```

##### 删除镜像

```bash
docker rmi [IMAGE ID]
```

## 容器操作

##### 查看容器

```bash
# 运行的容器
docker ps

# 所有容器
docker ps -a
```

##### 停止容器

```bash
docker stop [CONTAINER ID]
```

##### 删除容器

```bash
docker rm [CONTAINER ID]
```

## Dockerfile

DockerFile 是一个镜像的描述文件，里面描述了**创建一个镜像所需要的执行步骤**。我们也可以自定义 DockerFile 创建一个自己的镜像。

例如下面的 DockerFile：

```dockerfile
FROM nginx:1.15-alpine
COPY html /etc/nginx/html
COPY conf /etc/nginx/
WORKDIR /etc/nginx/html
```

这个 DockerFile 可描述为：

1. 基于 `nginx:1.15` 镜像做底座。
2. 拷贝本地 `html` 文件夹内的文件，到 镜像内 `/etc/nginx/html` 文件夹。
3. 拷贝本地 `conf` 文件夹内的文件，到 镜像内 `/etc/nginx/` 文件夹。

怎么生成镜像呢？我们只需要使用 `docker build` 命令就可以生成了：

```
docker build -t imagename:version .
```

> -t: 声明要打 tag 标签，后面就是标签 . ：声明要寻找 dockerfile 文件的路径。“.” 代表当前路径下寻找
