# MAC 系统查看端口占用情况

MAC 系统下使用 lsof 命令查看端口占用情况

1 \$ lsof

可以使用如下命令实现分页

1 \$ lsof | less

使用如下命令查看特定端口

1 \$ lsof -i:8080

如果端口被占用，则会返回相关信息，如果没被占用，则不返回任何信息。

以上命令会返回占用端口的进程 PID,可以用 kill 命令杀死进程

1 \$ kill PID

## lsof 语法格式是：

lsof ［options］ filename

常用的参数列表：

lsof filename 显示打开指定文件的所有进程
lsof -a 表示两个参数都必须满足时才显示结果
lsof -c string 显示 command 列中包含指定字符的进程所有打开的文件
lsof -u username 显示所属 user 进程打开的文件
lsof -g gid 显示归属 gid 的进程情况
lsof +d /dir/ 显示目录下被进程打开的文件
lsof +d /dir/ 同上，但是会搜索目录下的所有目录，时间相对较长
lsof -d fd 显示指定文件描述符的进程
lsof -n 不将 ip 转换为 hostname，缺省是不加上-n 参数
lsof -i 用以显示符合条件的进程情况
lsof -i[46][protocol][@hostname|hostaddr][:service|port]
46 --> ipv4 or ipv6
protocol --> tcp or udp
hostname --> internet host name
hostaddr --> ipv4 地址
service --> /etc/service 中的 service name (可以不只一个)
port --> 端口号 (可以不只一个)

查看所属 root 用户进程所打开的文件类型为 txt 的文件:

1 \$ lsof -a -u root -d txt
