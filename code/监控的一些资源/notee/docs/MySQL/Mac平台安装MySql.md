# Mac 平台安装 MySql

## 1.下载安装包

https://downloads.mysql.com/archives/community/

![截屏2022-04-14 下午12.47.44](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/04-14-ePoL2P.png)

## 2.安装

点击安装包即可开始安装。

安装完成后会显示 root 的临时密码（如：root@localhost: ?nt62r8lvrcY），注意拷贝下来

## 3.配置环境变量

编辑`.bash_profile`文件,如果没有会自动创建

```bash
vi ~/.bash_profile
```

设置 `mysql`和`mysqladmin`的别名

```bash
alias mysql=/usr/local/mysql/bin/mysql
alias mysqladmin=/usr/local/mysql/bin/mysql
```

把 `MySql`的`bin`目录地址加入`PATH`中

```bash
MYSQL_HOME=/usr/local/mysql
PATH="$PATH:$MYSQL_HOME/bin"
```

> 最终.bash_profile
>
> ```bash
> alias mysql=/usr/local/mysql/bin/mysql
> alias mysqladmin=/usr/local/mysql/bin/mysql
>
> JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_301.jdk/Contents/Home
> MYSQL_HOME=/usr/ local/mysql
> MAVEN_HOME=/usr/local/apache-maven-3.3.9
>
> PATH="$PATH:$JAVA_HOME/bin:$MYSQL_HOME/bin:$MAVEN_HOME/bin"
>
> CLASSPATH=$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar:.
>
> export JAVA_HOME
> export PATH
> export CLASSPATH
> ```

## 4.启动/停止

在系统偏好中启动 MySql

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/04-14-BdEDem.png" style="zoom: 33%;" />

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/04-14-BujIcc.png"  style="zoom: 33%;" />

## 5.修改 root 密码

```bash
mysql -u root -p  # 登录 root 账号
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('root'); #修改root密码方法
flush privileges;	#立即刷新

#退出重启 MySQL 服务，重新登录 root
```

## 6.新建数据库&新建用户&赋权限

1. 创建`test`数据库，字符集是 utf8

   ```bash
   CREATE DATABASE test DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
   ```

2. 创建用户 `zwh`

   ```bash
   CREATE USER 'zwh'@'localhost' IDENTIFIED BY '123456'; #本地登录
   CREATE USER 'zwh'@'%' IDENTIFIED BY '123456'; #远程登录
   ```

3. 给用户 `zwh` 赋权限

   ```bash
   GRANT ALL PRIVILEGES ON test.* to 'zwh'@'localhost' IDENTIFIED BY '123456'; #赋全部权限
   GRANT select,create ON test.* to 'zwh'@'localhost' IDENTIFIED BY '123456'; #赋部分权限
   flush privileges; #立即刷新
   ```
