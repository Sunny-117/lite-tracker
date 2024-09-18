# Linux 系统安装 Redis

## 1.将 Redis 源码安装包上传到 Linux

redis-4.0.0.tar.gz

http://gofile.me/6R0LC/HHOZl1xM3

## 2.解压安装包

```bash
tar -zxvf redis-4.0.0.tar.gz -C /usr/local
```

## 3.安装 Redis 的依赖环境 gcc

```bash
yum install gcc-c++
```

## 4.编译安装包

进入解压好的目录，make 编译

```bash
cd /usr/local/redis-4.0.0
make
```

## 5.安装

进入 redis 的 src 目录，进行安装

```bash
cd /usr/local/redis-4.0.0/src
make install
```

## 6.修改配置文件

daemonize no 修改为 yes
bind 127.0.0.1 修改为 bind 0.0.0.0

```bash
vim /usr/local/redis-4.0.0/redis.conf

daemonize yes
bind 0.0.0.0
```

> - `daemonize:yes` redis 采用的是单进程多线程的模式。当 redis.conf 中选项 daemonize 设置成 yes 时，代表开启守护进程模式。在该模式下，redis 会在后台运行，并将进程 pid 号写入至 redis.conf 选项 pidfile 设置的文件中，此时 redis 将一直运行，除非手动 kill 该进程。
> - `daemonize:no` 当 daemonize 选项设置成 no 时，当前界面将进入 redis 的命令行界面，exit 强制退出或者关闭连接工具(putty,xshell 等)都会导致 redis 进程退出。
> - `bind 0.0.0.0` 允许所有远程 ip 连接，默认是`bind 127.0.0.1`只允许本地服务器连接。
> - 如果需要启用密码，取消 requirepass 注释，requirepass 123456

## 7.拷贝配置文件到 src 目录

```bash
cp redis.conf src
```

## 8.启动服务

按照`redis.conf`配置启动服务

```bash
cd /usr/local/redis-4.0.0/src
./redis-server redis.conf
```

## 9.验证是否启动成功

```bash
ps -ef | grep redis

root       9178      1  0 11:53 ?        00:01:04 ./redis-server 0.0.0.0:6379
```

## 10.连接 redis

```bash
cd /usr/local/redis-4.0.0/src

./redis-cli
```
