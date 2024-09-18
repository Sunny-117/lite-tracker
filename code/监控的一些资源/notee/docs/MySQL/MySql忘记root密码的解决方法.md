# MySql 忘记 root 密码的解决方法

### 方法一:

1.在 my.ini 的[mysqld]字段加入：skip-grant-tables 2.重启 mysql 服务，这时的 mysql 不需要密码即可登录数据库
mysql>use mysql;
mysql>update user set password=password('新密码') WHERE User='root';
mysql>flush privileges; 3.运行之后最后去掉 my.ini 中的 skip-grant-tables 4.重启 mysqld 即可。

## 方法二:

不使用修改 my.ini 重启服务的方法，通过非服务方式加 skip-grant-tables 运行 mysql 来修改 mysql 密码

1.停止 mysql 服务 2.打开命令行窗口，在 bin 目录下使用 mysqld-nt.exe 启动，即在命令行窗口执行: mysqld-nt --skip-grant-tables 3.然后另外打开一个命令行窗口，登录 mysql，此时无需输入 mysql 密码即可进入。 4.修改密码:
mysql>use mysql;
mysql>update user set password=password('新密码') WHERE User='root';
mysql>flush privileges; 5.关闭命令行运行 mysql 的那个窗口，此时即关闭了 mysql，如果发现 mysql 仍在运行的话可以结束掉对应进程来关闭。 6.启动 mysql 服务
