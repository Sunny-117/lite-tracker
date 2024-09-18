# MySql 读写分离配置

## 介绍

MySQL 服务器如果只有一台，那么就可能会存在如下问题：

1. 读和写所有压力都由一台数据库承担，压力大
2. 数据库服务器磁盘损坏则数据丢失，单点故障

##### 解决方案

为了解决上述提到的两个问题，我们可以准备两台 MySQL，一台主(Master)服务器，一台从(Slave)服务器，主库的数据变更，需要同步到从库中(主从复制)。而用户在访问我们项目时，如果是写操作(insert、update、delete)，则直接操作主库；如果是读(select)操作，则直接操作从库(在这种读写分离的结构中，从库是可以有多个的)，这种结构我们称为 **读写分离** 。

MySQL 数据库默认是支持主从复制的，MySQL 主从复制是一个异步的复制过程，底层是基于 Mysql 数据库自带的 **二进制日志** 功能。就是一台或多台 MySQL 数据库（slave，即**从库**）从另一台 MySQL 数据库（master，即**主库**）进行日志的复制，然后再解析日志并应用到自身，最终实现 **从库** 的数据和 **主库** 的数据保持一致。MySQL 主从复制是 MySQL 数据库自带功能，无需借助第三方工具。

> 二进制日志（BINLOG）记录了所有的 DDL（数据定义语言）语句和 DML（数据操纵语言）语句，但是不包括数据查询语句。此日志对于灾难时的数据恢复起着极其重要的作用，MySQL 的主从复制， 就是通过该 binlog 实现的。默认 MySQL 是未开启该日志的。

##### MySQL 的主从复制原理如下：

![image-20210825110417975](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-13-BxIAva.png)

##### MySQL 复制过程分成三步：

1). MySQL master 将数据变更写入二进制日志( binary log)

2). slave 将 master 的 binary log 拷贝到它的中继日志（relay log）

3). slave 重做中继日志中的事件，将数据变更反映它自己的数据

## 配置-前置条件

提前准备好两台服务器，分别安装 mysql、开放 3306 端口，并启动 mysql 服务

| 数据库 | IP             | 数据库版本 |
| ------ | -------------- | ---------- |
| Master | 172.16.137.201 | 5.7.25     |
| Slave  | 172.16.137.202 | 5.7.25     |

```bash
#开放指定端口
firewall-cmd --zone=public --add-port=3306/tcp --permanent

#立即生效
firewall-cmd --reload

#查看开放的端口
firewall-cmd --zone=public --list-ports

---------------

#启动mysql
systemctl start mysqld

#查看mysql是否启动成功
ps -ef | grep mysql
```

## 配置-主库 Master

服务器： 172.16.137.201

### 修改配置文件

修改`/etc/my.cnf`配置文件，增加`log-bin`和`server-id`，重启 mysql

```bash
vim /etc/my.cnf

[mysqld]
log-bin=mysql-bin   #[必须]启用二进制日志
server-id=201      	#[必须]服务器唯一ID

# 重启mysql
systemctl restart mysqld
```

### 创建数据同步的用户并授权

登录 mysql

```mysql
#创建用户并授权
GRANT REPLICATION SLAVE ON *.* to 'slavetomaster'@'%' identified by 'zwhID123@';


#刷新权限
flush privileges;
```

> 上面 SQL 的作用是创建一个用户`slavetomaster`，密码为`zwhID123@`，并且给`slavetomaster`用户授予 REPLICATION SLAVE 权限。常用于建立复制时所需要用到的用户权限，也就是 slave 必须被 master 授权具有该权限的用户，才能通过该用户复制。

> mysql 密码复杂度（密码校验策略）:
>
> - 0 or LOW：校验级别最低，只校验密码长度，只要长度跟 validate_password_length 一样即可，默认长度是 8 位。可以通过：
> - 1 or MEDIUM：首先要满足的是 validate_password_policy=0 时的验证要求。然后现去验证密码中的数字个数，大小写个数，特殊字符个数。这些又分别由 validate_password_number_count，validate_password_mixed_case_count，validate_password_special_char_count 这几个参数来控制。
> - 2 or STRONG：必须先满足 0，1 的要求，然后它还追加了一个，对于密码中任意连续 4 个(或 4 个让上)字符不得是字典中的单词（validate_password_dictionary_file）
>
> ```bash
> # 查看密码校验策略
> show variables like 'validate_password_policy';
>
> +--------------------------+--------+
> | Variable_name            | Value  |
> +--------------------------+--------+
> | validate_password_policy | MEDIUM |
> +--------------------------+--------+
> ```
>
> mysql5.7 默认密码校验策略等级为 MEDIUM，可通过以下命令修改
>
> ```mysql
> set global validate_password_length=4;		# 设置密码长度最低位数
> set global validate_password_policy=LOW;	# 设置密码安全等级低，密码可以修改成root
> ```

### 查看 master 同步状态

执行下面 SQL，记录下结果中**File**和**Position**的值

```bash
show master status;

+------------------+----------+--------------+------------------+-------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+------------------+----------+--------------+------------------+-------------------+
| mysql-bin.000002 |      446 |              |                  |                   |
+------------------+----------+--------------+------------------+-------------------+
```

> 上面 SQL 的作用是查看 Master 的状态，执行完此 SQL 后不要再执行任何操作

## 配置-从库 Slave

服务器： 172.16.137.202

### 修改配置文件

修改`/etc/my.cnf`配置文件，增加`server-id`，重启 mysql

```bash
vim /etc/my.cnf

[mysqld]
server-id=202      	#[必须]服务器唯一ID

# 重启mysql
systemctl restart mysqld
```

### 设置主库地址及同步位置

```mysql
#设置主库地址及同步位置
change master to master_host='172.16.137.201',master_user='slavetomaster',master_password='zwhID123@',master_log_file='mysql-bin.000002',master_log_pos=446;

#开始从库
start slave;
```

> - master_host : 主库的 IP 地址
> - master_user : 访问主库进行主从复制的用户名(上面在主库创建的)
> - master_password : 访问主库进行主从复制的用户名对应的密码
> - master_log_file : 从哪个日志文件开始同步(上述查询 master 状态中展示的有)
> - master_log_pos : 从指定日志文件的哪个位置开始同步(上述查询 master 状态中展示的有)

### 查看从库状态

```mysql
# 查看从库状态
# show slave status;

# 查看从库状态, 使用列形式打印
show slave status\G;
```

> 如果是通过克隆虚拟机方式创造第二台虚拟机，那么它们的 server_uuid 是同一个，这是 mysql 在启动的时候自动生成的一个身份 id。
>
> 这时候从库状态有一个 IO 错误
>
> ```bash
> Last_IO_Error: error connecting to master 'slavetomaster@172.16.137.201:3306' - retry-time: 60  retries: 1
> ```
>
> 把这个`auto.cnf`文件改名，然后重启 mysql 即可，mysql 会重新生成这个文件以及 uuid 值
>
> ```bash
> #auto.cnf改为其他名字
> mv /var/lib/mysql/auto.cnf /var/lib/mysql/auto.cnf.bak
> #重启mysql
> systemctl restart mysqld
> ```
>
> 这时候再查看从库状态，会看到`Last_IO_Error`消失了。
>
> ```bash
> #查询 auto.cnf 文件的所在位置
> find / -name 'auto.cnf'
>
> #查看server-uuid
> cat /var/lib/mysql/auto.cnf
> ```

## 测试

在主库 Master 执行操作，查看从库 Slave 中是否将数据同步过去即可。

```mysql
create database aa;
```

```mysql
# 查询走 ::: DataSources: slave
[INFO] 17:16:39.754 [http-nio-8888-exec-8] ShardingSphere-SQL - SQL: SELECT COUNT(*) FROM employee ::: DataSources: slave

# 新增走 ::: DataSources: master
[INFO] 17:16:39.754 [http-nio-8888-exec-8] ShardingSphere-SQL - SQL: INSERT INTO employee  ( id,
username,
?,
? ) ::: DataSources: master
```
