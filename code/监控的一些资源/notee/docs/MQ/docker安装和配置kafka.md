## docker 安装和配置 kafka

kafka 对与 zookeeper 是强依赖的，是以 zookeeper 作为基础的，即使不做集群，也需要 zookeeper 的支持。

Kafka 通过 Zookeeper 管理集群配置，选举 leader，以及在 Consumer Group 发生变化时进行重平衡。

```bash
# 拉取zookeeper镜像
docker pull wurstmeister/zookeeper

# kafka镜像
docker pull wurstmeister/kafka

# 运行 zookeeper 容器
docker run -d --name zookeeper -p 2181:2181 wurstmeister/zookeeper

# 运行 kafka 容器
docker run -d --name kafka -p 9092:9092 -e KAFKA_BROKER_ID=0 -e KAFKA_ZOOKEEPER_CONNECT=192.168.211.136:2181/kafka -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.211.136:9092 -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 wurstmeister/kafka
```

##### 参数说明：

> -e KAFKA_BROKER_ID=0 在 kafka 集群中，每个 kafka 都有一个 BROKER_ID 来区分自己
>
> -e KAFKA_ZOOKEEPER_CONNECT=172.16.0.13:2181/kafka 配置 zookeeper 管理 kafka 的路径 172.16.0.13:2181/kafka
>
> -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://172.16.0.13:9092 把 kafka 的地址端口注册给 zookeeper，如果是远程访问要改成外网 IP,类如 Java 程序访问出现无法连接。
>
> -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 配置 kafka 的监听端口
>
> -v /etc/localtime:/etc/localtime 容器时间同步虚拟机的时间
>
> --env KAFKA_ADVERTISED_HOST_NAME 改为宿主机器的 IP 地址，如果不这么设置，可能会导致在别的机器上访问不到 kafka。
>
> --env KAFKA_ZOOKEEPER_CONNECT 设置 zookeeper 主机
>
> --env KAFKA_ADVERTISED_PORT kafka 端口
>
> KAFKA_HEAP_OPTS=”-Xmx256M -Xms128M” 修改内存不足的问题

##### 模板:

```bash
docker run -d --name kafka --publish 9092:9092 --link zookeeper --env KAFKA_ZOOKEEPER_CONNECT=zookeeperip地址:端口 --env KAFKA_ADVERTISED_HOST_NAME=宿主机ip地址 --env KAFKA_ADVERTISED_PORT=kafka要设置的端口号 --env KAFKA_HEAP_OPTS="-Xmx256M -Xms128M" --volume /etc/localtime:/etc/localtime wurstmeister/kafka:latest
```

##### 验证 kafka 是否可以使用

```bash
# 进入容器
docker exec -it kafka bash

# 进入 /opt/kafka/bin/ 目录下
# 或者 cd /opt/kafka_2.12-2.3.0/bin/
cd /opt/kafka/bin/


# 运行kafka生产者发送消息
./kafka-console-producer.sh --broker-list localhost:9092 --topic sun

# 发送消息
> {"datas":[{"channel":"","metric":"temperature","producer":"ijinus","sn":"IJA0101-00002245","time":"1543207156000","value":"80"}],"ver":"1.0"}

# 运行kafka消费者接收消息
./kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic sun --from-beginning



# 列出所有topics (在本地kafka路径下)
bin/kafka-topics.sh --zookeeper localhost:2181 --list

# 列出所有Kafka brokers
docker exec zookeeper bin/zkCli.sh ls /brokers/ids
```
