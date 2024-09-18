# Redis 集群安装

```bash
#创建文件目录
mkdir -p /mnt/redis/r1/data
mkdir -p /mnt/redis/r2/data
mkdir -p /mnt/redis/r3/data
mkdir -p /mnt/redis/r4/data
mkdir -p /mnt/redis/r5/data
mkdir -p /mnt/redis/r6/data
```

准备 Redis 配置文件，需要准备 6 份，第一份：

执行命令 `vi /mnt/redis/r1/redis.conf` 内容为：

```bash
port 7001
bind 0.0.0.0
protected-mode no
databases 1
appendonly yes
#开启集群
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 15000
```

配置文件注意路径不同，端口号为 7001~7006

编写 `vim /mnt/redis/docker-compose.yml` ，内容为：

```yaml
version: '3.6'
services:
  redis1:
    container_name: redis1
    image: redis:5.0.9
    network_mode: host
    volumes:
      - /mnt/redis/r1/redis.conf:/config/redis.conf
      - /mnt/redis/r1/data:/data
    command: ['redis-server', /config/redis.conf]
    restart: always
  redis2:
    container_name: redis2
    image: redis:5.0.9
    network_mode: host
    volumes:
      - /mnt/redis/r2/redis.conf:/config/redis.conf
      - /mnt/redis/r2/data:/data
    command: ['redis-server', /config/redis.conf]
    restart: always
  redis3:
    container_name: redis3
    image: redis:5.0.9
    network_mode: host
    volumes:
      - /mnt/redis/r3/redis.conf:/config/redis.conf
      - /mnt/redis/r3/data:/data
    command: ['redis-server', /config/redis.conf]
    restart: always
  redis4:
    container_name: redis4
    image: redis:5.0.9
    network_mode: host
    volumes:
      - /mnt/redis/r4/redis.conf:/config/redis.conf
      - /mnt/redis/r4/data:/data
    command: ['redis-server', /config/redis.conf]
    restart: always
  redis5:
    container_name: redis5
    image: redis:5.0.9
    network_mode: host
    volumes:
      - /mnt/redis/r5/redis.conf:/config/redis.conf
      - /mnt/redis/r5/data:/data
    command: ['redis-server', /config/redis.conf]
    restart: always
  redis6:
    container_name: redis6
    image: redis:5.0.9
    network_mode: host
    volumes:
      - /mnt/redis/r6/redis.conf:/config/redis.conf
      - /mnt/redis/r6/data:/data
    command: ['redis-server', /config/redis.conf]
    restart: always
```

执行服务编排：

```bash
#进入指定路径
cd /mnt/redis

#服务编排启动Redis集群
docker-compose up -d
```

启动集群：

```bash
# 进入容器内部
docker exec -it redis1 /bin/bash

#执行Redis集群创建命令，注意要修改所有的192.168.211.128为自己设备的实际IP，如果使用云服务器，则使用公网IP
redis-cli --cluster create 192.168.211.128:7001 192.168.211.128:7002 192.168.211.128:7003 192.168.211.128:7004 192.168.211.128:7005 192.168.211.128:7006 --cluster-replicas 1

#集群节点信息
redis-cli -p 7001 cluster nodes

# 连接集群
redis-cli -h 127.0.0.1 -p 7001 -c
```

_如果卡在 `Waiting for the cluster to join` 这一步，检查端口号是否开放。redis 集群除了需要使用 7001~7006，还需要开通集群总线端口，端口号为 redis 端口号+10000 在这里就是端口号为 17001~17006 的都需要开放_

**注意：**

集群启动成功后，需要在宿主机中检查集群节点的配置文件（Ctrl+d 可以退出容器）

```bash
#查看配置文件命令：
cat /mnt/redis/r1/data/nodes.conf

# 如果出现内网IP(例如172.x.x.x)，则需要修改宿主机的集群配置文件
# 检查6个配置文件，把所有的内网IP都改为当前公网IP
# 在宿主机分别执行以下命令，分别进行修改：
vi /mnt/redis/r1/data/nodes.conf
vi /mnt/redis/r2/data/nodes.conf
vi /mnt/redis/r3/data/nodes.conf
vi /mnt/redis/r4/data/nodes.conf
vi /mnt/redis/r5/data/nodes.conf
vi /mnt/redis/r6/data/nodes.conf

#进入指定路径
cd /mnt/redis

#服务编排停止Redis集群并删除容器
docker-compose down

#服务编排启动Redis集群
docker-compose up -d
```
