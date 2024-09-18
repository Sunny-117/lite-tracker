# Nacos 集群搭建

在 standalone 模式下,Nacos 默认使用 derby 数据库来存储配置信息。

在 Nacos_PATH/data 目录,有一个 derby-data 的文件, Derby 是 Java 编写的数据库,是 Apache 的开源项目,默认的所有配置就是存在 derby 这个数据库中。

Nacos 集群支持 mysql 数据库。

## 1.集群结构图

官方给出的 Nacos 集群图：

![image-20210409210621117](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-28-zUEM4R.png)

其中包含 3 个 nacos 节点，一个负载均衡器代理 3 个 Nacos

这里的集群结构图：

![image-20210409211355037](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-28-cIey1X.png)

三个 nacos 节点(至少 3 个)和 nginx、mysq 服务器的地址：

| 节点   | ip              | port |
| ------ | --------------- | ---- |
| nacos1 | 192.168.150.101 | 8845 |
| nacos2 | 192.168.150.102 | 8846 |
| nacos3 | 192.168.150.103 | 8847 |
| nginx  | 192.168.150.110 | 80   |
| mysql  | 192.168.150.111 | 3306 |

> 负载均衡器使用 nginx，mysql 主从简化为一个服务器
>
> **以上服务器需先开放端口**

## 2.搭建集群

搭建集群的基本步骤：

- 下载 nacos 安装包
- 配置 nacos
- 初始化数据库表结构
- 部署并启动 nacos 集群
- 配置 nginx 反向代理

### 2.1 下载 nacos 安装包

在 Nacos 的 GitHub 页面，提供有下载链接，可以下载编译好的 Nacos 服务端或者源代码：

GitHub 主页：https://github.com/alibaba/nacos

GitHub 的 Release 下载页：https://github.com/alibaba/nacos/releases

> 这里`nacos-server-1.4.1.zip`为例

![image-20220527201351364](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-28-S25UZq.png)

### 2.2 配置 Nacos

将安装包解压到任意非中文目录下

- bin：启动脚本
- conf：配置文件

##### 配置 Nacos 节点

进入`nacos/conf`目录，修改文件`cluster.conf.example`，并重命名为`cluster.conf`

添加 Nacos 节点信息

```bash
192.168.150.101:8848
192.168.150.102:8848
192.168.150.103:8848
```

##### 配置数据库信息

进入`nacos/conf`目录，修改文件`application.properties`

添加相应的数据库信息

```properties
spring.datasource.platform=mysql

db.num=1

db.url.0=jdbc:mysql://192.168.150.111:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user.0=root
db.password.0=root
```

> 可配置多个 mysql 数据库
>
> db.num=2
> db.url.1=jdbc:mysql://192.168.150.111:3306/nacos
> db.user.1=root
> db.password.1=root

### 2.3 初始化数据库表结构

在 mysql 数据库服务器中创建`nacos`数据库，并上传运行`nacos/conf/nacos-mysql.sql`初始化数据库表结构

### 2.4 部署并启动 nacos 集群

将配置好的`nacos目录`分别上传到三个 nacos 节点服务器的`/usr/local`目录，并进去 bin 目录启动 nacos

```bash
cd /usr/local/nacos/bin

# 默认按照集群模式启动
./startup.sh

# 查看启动情况
more /usr/local/nacos/logs/start.out
```

> ```bash
> # 停止服务
> ./shutdown.sh
> ```

### 2.5 配置 nginx 反向代理

配置 nginx 服务器`192.168.150.110`

```nginx
upstream nacos-cluster {
  server 192.168.150.101:8848;
	server 192.168.150.102:8848;
	server 192.168.150.103:8848;
}

server {
    listen       80;
    server_name  localhost;

    location /nacos {
        proxy_pass http://nacos-cluster;
    }
}
```

在浏览器访问 nginx 服务器：http://192.168.150.110/nacos

用户: nacos, 密码: nacos
