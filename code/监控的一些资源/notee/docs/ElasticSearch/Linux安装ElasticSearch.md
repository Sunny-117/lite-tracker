# Linux 安装 ElasticSearch

## 下载

在官网下载对应版本，这里用的是`elasticsearch-7.12.1-linux-x86_64.tar.gz`

https://www.elastic.co/cn/downloads/past-releases/elasticsearch-7-12-1

## 安装

上传到服务器，并解压到`/usr/local`目录下

```bash
tar -zxvf elasticsearch-7.12.1-linux-x86_64.tar.gz -C /usr/local
```

## 配置 elasticsearch

编辑 elasticsearch 的配置文件

```bash
vim /usr/local/elasticsearch-7.12.1/config/elasticsearch.yml
```

```bash
# 集群名称，同一个网段自动加入
cluster.name: my-application

# 节点名称
node.name: node-1

# 默认只允许本机访问，开启远程访问
network.host: 0.0.0.0

# 端口号
http.port: 9200

#初始化的节点
cluster.initial_master_nodes: ["node-1"]
```

## 创建用户

root 用户不能直接启动 Elasticsearch，所以需要创建一个专用用户，来启动 ES

```bash
# 创建专用用户
useradd user-es

# 设置密码
passwd user-es

# 创建所属组：
chown user-es:user-es -R /usr/local/elasticsearch-7.12.1

# 切换到user-es用户
su user-es

# 进入bin目录
cd /usr/local/elasticsearch-7.12.1/bin

# 后台启动elasticsearch
./elasticsearch -d

# 关闭进程
kill -9 pid
```

## 配置系统

这个时候如果直接启动，终端是会报错的

##### 错误 1:

```bash
bootstrap check failure [1] of [2]: max file descriptors [4096] for elasticsearch process is too low, increase to at least [65535]
```

主要是文件权限与内存大小问题：**elasticsearch 用户拥有的可创建文件描述的权限太低，至少需要 65536**，修改方法:

```bash
vim /etc/security/limits.conf
```

```bash
es hard nofile 65536
es soft nofile 65536
es hard nproc 4096
es soft nproc 4096
```

##### 错误 2:

```bash
bootstrap check failure [2] of [2]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
```

**max_map_count 文件包含限制一个进程可以拥有的 VMA(虚拟内存区域)的数量**，修改方法:

```bash
vim /etc/sysctl.conf
```

```bash
vm.max_map_count = 655360
```

```bash
# 参数立即生效
sysctl -p
```

##### 错误 3:

```bash
the default discovery settings are unsuitable for production use; at least one of [discovery.seed_hosts, discovery.seed_providers, cluster.initial_master_nodes] must be configured
```

**指定初始化集群的节点**，修改方法:

```bash
vim /usr/local/elasticsearch-7.12.1/config/elasticsearch.yml
```

```bash
#初始化的节点
cluster.initial_master_nodes: ["node-1"]
```

## 启动

```bash
# 切换到user-es用户
su user-es

# 后台启动elasticsearch
./elasticsearch -d
```

启动后没有报错，并且在浏览器能访问就成功了。`http://192.168.211.128:9200/`

# Linux 安装 Kibana

## 下载

在官网下载对应版本，这里用的是`kibana-7.12.1-linux-x86_64.tar.gz`

https://www.elastic.co/cn/downloads/past-releases/kibana-7-12-1

## 安装

上传到服务器，并解压到`/usr/local`目录下

```bash
tar -zxvf kibana-7.12.1-linux-x86_64.tar.gz -C /usr/local
```

## 配置 kibana

```bash
vim /kibana-7.12.1-linux-x86_64/config/kibana.yml
```

```bash
# 默认端口5601
server.port: 5601

# 开启kibana远程访问
server.host: "0.0.0.0"

# ES服务器地址
elasticsearch.hosts: ["http://localhost:9200"]

# ES的用户名
elasticsearch.username: "user-es"

# ES的密码
elasticsearch.password: "user-es"
```

## 配置权限

root 用户不能直接启动 kibana

```bash
# 创建所属组：
chown user-es:user-es -R /usr/kibana-7.12.1-linux-x86_64

# 切换到user-es用户
su user-es

# 进入bin目录
cd /usr/local/kibana-7.12.1-linux-x86_64/bin

# 后台启动kibana
nohup ./kibana &

# 查看进程
netstat -tunlp|grep 5601

# 关闭进程
kill -9 pid
```

浏览器能访问就成功了。http://192.168.211.128:5601

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
        <comment>IK Analyzer 扩展配置</comment>
        <!--用户可以在这里配置自己的扩展字典 *** 添加扩展词典-->
        <entry key="ext_dict">ext.dic</entry>
</properties>
```

> 多个字典用;号间隔
