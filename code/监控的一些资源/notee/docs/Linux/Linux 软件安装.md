# Linux 软件安装

## 软件安装方式

- 二进制发布包安装

  软件已经针对具体平台编译打包发布，只要解压，修改配置即可

- rpm 安装

  软件已经按照 redhat 的包管理规范进行打包，使用 rpm 命令进行安装，不能自行解决库依赖问题

- yum 安装
  一种在线软件安装方式，本质上还是 rpm 安装，自动下载安装包并安装，安装过程中自动解决库依赖问题

- 源码编译安装
  软件以源码工程的形式发布，需要自己编译打包

## 安装 jdk(二进制包方式)

1. 检查 linux 有没有安装过 jdk ，如果有，先卸载(有些 linux 环境自带 rpm 方式的 jdk)

```bash
rpm -qa|grep jdk  			 # 查看安装过的jdk软件
rpm -e --nodeps 软件名称  # 卸载软件
```

2. 上传 jdk 的二进制发布包到 Linux
3. 解压安装包到 /usr/loca

```bash
tar -zxvf jdk-8u171-linux-x64.tar.gz -C /usr/loca
```

4. 配置环境变量

```bash
vi /etc/profile  # 编辑配置文件

JAVA_HOME=/usr/local/jdk1.8.0_171
PATH=$JAVA_HOME/bin:$PAT
```

5. 使配置文件生效

```bash
source /etc/profile
```

6. 验证是否安装成功

```bash
java -version
----------------------------------------------------
java version "1.8.0_171"
Java(TM) SE Runtime Environment (build 1.8.0_171-b11)
Java HotSpot(TM) 64-Bit Server VM (build 25.171-b11, mixed mode)
```

## 安装 Tomcat(二进制包方式)

1. 上传 Tomcat 的二进制发布包到 Linux
2. 解压安装包到 /usr/loca

```bash
tar -zxvf apache-tomcat-7.0.57.tar.gz -C /usr/local
```

3. 进入 Tomcat 的 bin 目录启动服务

```bash
cd /usr/local/apache-tomcat-7.0.57/bin

./startup.sh # 启动 Tomcat 服务
						 # sh startup.sh
```

4. 验证是否启动成功

```bash
ps -ef | grep tomcat  # 查看是否有 Tomcat 进程

root  47238  1  0  19:04  pts/2  00:00:17 /usr/local/apache-tomcat-7.0.57/...
```

5. 开放防火墙

```bash
firewall-cmd --zone=public --add-port=8080/tcp --permanent  # 开放8080端口
firewall-cmd --reload																				# 立即生效

firewall-cmd --zone=public --list-ports											# 查看开放的端口
```

6. 停止 Tomcat 服务

- 用脚本文件停止服务

  ```bash
  cd /usr/local/apache-tomcat-7.0.57/bin

  ./shutdown.sh  # 停止 Tomcat 服务
  							 # sh shutdown.sh
  ```

- 结束 Tomcat 进程停止服务

  ```bash
  ps -ef | grep tomcat

  root  47238  1  0  19:04  pts/2  00:00:17 /usr/local/apache-tomcat-7.0.57/...

  kill -9 47238   # -9: 强制结束
  ```

## 安装 MySQL(rpm 方式)

1. 检查 linux 有没有安装过 mysql 和 mariadb，如果有，必须全部卸载

```bash
rpm -qa | grep mysq     # 查询当前系统中安装的名称带mysql的软件
rpm -qa | grep mariadb  # 查询当前系统中安装的名称带mariadb的软件

rpm -e --nodeps 软件名称 # 卸载软件
```

2. 上传 mySQL 的 rpm 安装包到 Linux

mysql-5.7.25-1.el7.x86_64.rpm-bundle.tar.gz

3. 新建 mysql 目录，解压缩包

```bash
mkdir /usr/local/mysql
tar -zxvf mysql-5.7.25-1.el7.x86_64.rpm-bundle.tar.gz -C /usr/local/mysql
```

4. 按照顺序安装 rpm 软件包

```bash
rpm -ivh mysql-community-common-5.7.25-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-5.7.25-1.el7.x86_64.rpm
rpm -ivh mysql-community-devel-5.7.25-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-compat-5.7.25-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-5.7.25-1.el7.x86_64.rpm
rpm -ivh mysql-community-server-5.7.25-1.el7.x86_64.rpm
```

> 安装过程中提示缺少 net-tools 依赖，使用 yum 安装 `yum install net-tools -y`
> 因为 rpm 安装方式，是不会自动处理依赖关系的，需要我们自己处理，所以对于上面的 rpm 包的安装顺序不能随意修改。
> 可以通过指令(yum update)升级现有软件及系统内核

5. 启动 mysql

```bash
systemctl start mysqld		# 启动mysql服务
systemctl enable mysqld		# 设置开机启动mysql服务
```

6. 验证是否启动成功

- 查看 mysql 服务状态

  ```bash
  systemctl status mysqld		# 查看mysql服务状态  active (running)
  ```

- 通过查看**进程**是否存在

  ```bash
  ps -ef | grep mysql
  mysql  29066 1  0 19:49 00:00:03 /usr/sbin/mysqld --daemonize --pid-file=/var/run/mysqld/mysqld.pid

  ```

- 通过查看**服务**是否存在

  ```bash
  netstat -tunlp               # 查看已经启动的服务
  netstat -tunlp | grep mysql  # 查看 mysql 服务是否已启动
  ```

> 结束 mysql 服务: systemctl stop mysqld
>
> 或用结束进程的方式

7. 查看 mysql 日志里生成的临时密码

   ```bash
   cat /var/log/mysqld.log | grep password
   ```

8. 登录 MySQL，修改密码，开放访问权限

   ```bash
   mysql -u root –p				# 登录mysql (使用临时密码登录)

   # 修改密码
   set global validate_password_length=4;		# 设置密码长度最低位数
   set global validate_password_policy=LOW;	# 设置密码安全等级低，密码可以修改成root
   set password = password('root');					# 设置密码为root

   # 开启访问权限 (默认情况下,mysql只允许本地访问)
   grant all on *.* to 'root'@'%' identified by 'root';  # 允许root账户用root密码从任意地址连接
   flush privileges;													# 刷新权限，使之生效
   ```
