# Mac 和 Linux 环境的 MySQL 编码设置

MySQL 的默认编码格式是`latin1`，需要设置为`utf-8`，否则显示中文会出现乱码

## 1.检查编码

在终端的登录 mysql 后检查编码

```bash
show variables like '%char%';
```

会显示如下配置

```bash
mysql> show variables like '%char%';

+--------------------------+-----------------------------------------------------------+
| Variable_name            | Value                                                     |
+--------------------------+-----------------------------------------------------------+
| character_set_client     | latin1                                                      |
| character_set_connection | latin1                                                      |
| character_set_database   | latin1                                                      |
| character_set_filesystem | binary                                                    |
| character_set_results    | latin1                                                      |
| character_set_server     | latin1                                                      |
| character_set_system     | utf8                                                      |
| character_sets_dir       | /usr/local/mysql-5.7.24-macos10.14-x86_64/share/charsets/ |
+--------------------------+-----------------------------------------------------------+
8 rows in set (0.00 sec)
```

## 2.编辑 MySQL 配置文件

编辑 MySQL 的配置文件，可以把数据库默认的编码全部改为 UTF-8

MySQL 的配置文件默认存放在`/etc/my.cnf`或`/etc/mysql/my.cnf`

```bash
vi /etc/my.cnf
```

在`[client]`和`[mysqld]`标签下加入如下配置

```bash
[client]
default-character-set=utf8

[mysqld]
character-set-server=utf8
default-storage-engine=INNODB
collation-server=utf8_general_ci
```

保存后重启 mysql

## 3.验证

重新登录 `mysql` 后检查编码

```text
show variables like '%char%';
```

显示如下配置就可以了（filesystem 文件系统就是二进制格式的）

```bash
mysql> show variables like '%char%';
+--------------------------+-----------------------------------------------------------+
| Variable_name            | Value                                                     |
+--------------------------+-----------------------------------------------------------+
| character_set_client     | utf8                                                      |
| character_set_connection | utf8                                                      |
| character_set_database   | utf8                                                      |
| character_set_filesystem | binary                                                    |
| character_set_results    | utf8                                                      |
| character_set_server     | utf8                                                      |
| character_set_system     | utf8                                                      |
| character_sets_dir       | /usr/local/mysql-5.7.24-macos10.14-x86_64/share/charsets/ |
+--------------------------+-----------------------------------------------------------+
8 rows in set (0.00 sec)
```
