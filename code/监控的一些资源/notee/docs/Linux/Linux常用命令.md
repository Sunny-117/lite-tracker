# Linux 常用命令

## Linux 目录

- bin 存放二进制可执行文件
- boot 存放系统引导时使用的各种文件
- dev 存放设备文件
- etc 存放系统配置文件
- home 存放系统用户的文件
- lib 存放程序运行所需的共享库和内核模块
- opt 额外安装的可选应用程序包所放置的位置
- root 超级用户目录
- sbin 存放二进制可执行文件，只有 root 用户才能访问
- tmp 存放临时文件
- usr 存放系统应用程序
- var 存放运行时需要改变数据的文件，例如日志文件

![image-20220509170849825](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-09-mDZPej.png)

## 常用命令

| 序号 | 命令           | 对应英文             | 作用                    |
| ---- | -------------- | -------------------- | ----------------------- |
| 1    | ls [目录名]    | list                 | 查看当前目录下的内容    |
| 2    | pwd            | print work directory | 查看当前所在目录        |
| 3    | cd [目录名]    | change directory     | 切换目录                |
| 4    | touch [文件名] | touch                | 如果文件不存在,创建文件 |
| 5    | mkdir [目录名] | make directory       | 创建目录                |
| 6    | rm [文件名]    | remove               | 删除指定文件            |

### 显示指定目录下的内容

语法：`ls [-al] [dir]`

- -a 显示所有文件及目录 (. 开头的隐藏文件也会列出)
- -l 除文件名称外，同时将文件型态(d 表示目录，-表示文件)、权限、拥有者、文件大小等信息详细列出

> ls -l 可简写为 ll

### 切换工作目录

语法：`cd [dirName]`

> ~ 表示用户的 home 目录
> . 表示目前所在的目录
> .. 表示目前目录位置的上级目录

### 一次显示文件全部内容

语法： `cat [-n] fileName`

- -n ：由 1 开始对所有输出的行数编号

### 以分页的形式显示文件内容

语法： `more fileName`

- 回车键 向下滚动一行
- 空格键 向下滚动一屏
- b 返回上一屏
- q 或者 Ctrl+C 退出 more

### 查看文件末尾的内容

语法：`tail [-f] fileName`

- -f ：动态读取文件末尾内容并显示

```bash
tail /etc/profile		 			# 显示/etc目录下的profile文件末尾10行的内容
tail -20 /etc/profile	    # 显示/etc目录下的profile文件末尾20行的内容
tail -f  my.log	        	# 动态读取my.log文件末尾内容并显示
echo 1111 >> my.log       # 往my.log文件尾部追加内容
```

### 创建目录

语法：`mkdir [-p] dirName`

- -p：确保目录名称存在，不存在的就创建一个。通过此选项，可以实现多层目录同时创建

### 删除空目录

语法：`rmdir [-p] dirName`

- -p：当子目录被删除后使父目录为空目录的话，则一并删除

```bash
rmdir a   		# 删除名为a的空目录
rmdir -p a/b	# 删除a目录中名为b的子目录，若b目录删除后a目录变为空目录，则也被删除
rmdir aa*   	# 删除名称以a开始的空目录
```

### 删除文件或者目录

语法：`rm [-rf] name`

- -r：将目录及目录中所有文件（目录）逐一删除，即递归删除
- -f：无需确认，直接删除

```bash
rm -f a		# 无需确认，直接删除a目录(a目录必须是空的！)
rm -r a		# 删除名为a的目录和目录中所有文件，删除前需确认
rm -rf a  # 无需确认，直接删除名为a的目录和目录中所有文件
```

### 用于复制文件或目录

语法：`cp [-r] source destination`

- -r：如果复制的是目录需要使用此选项，此时将复制该目录下所有的子目录和文件

```bash
cp hello.txt a/     	# 将hello.txt复制到a目录中
cp hello.txt hi.txt   # 将hello.txt复制到当前目录，并改名为hi.txt
cp -r a/ b/						# 将a目录和目录下所有文件复制到b目录下=> cp -r a b
```

### 为文件或目录改名、或将文件或目录移动到其它位置

语法：`mv source destination`

```bash
mv hello.txt hi.txt    	# 将hello.txt改名为hi.txt
mv hi.txt a/  					# 将文件hi.txt移动到a目录中
mv hi.txt a/hello.txt   # 将hi.txt移动到a目录中，并改名为hello.txt
mv a/ b/                # 如果b目录不存在，将a目录改名为b
mv a/ b/                # 如果b目录存在，将a目录移动到b目录中
```

### 对文件进行打包、解包、压缩、解压

语法：`tar [-zcxvf] fileName [files]`

- -c：c 代表的是 create，即创建新的包文件
- -x：x 代表的是 extract，实现从包文件中还原文件
- -z：z 代表的是 gzip，通过 gzip 命令处理文件，gzip 可以对文件压缩或者解压
- -v：v 代表的是 verbose，显示命令的执行过程
- -f：f 代表的是 file，用于指定包文件的名称

> 包文件后缀为.tar 表示只是完成了打包，并没有压缩
> 包文件后缀为.tar.gz 表示打包的同时还进行了压缩

```bash
## 打包
tar -cvf aa.tar ./*	 		 # 将当前目录下所有文件打包，打包后的文件名为aa.tar
tar -zcvf bb.tar.gz ./*  # 将当前目录下所有文件打包并压缩，打包后的文件名为bb.tar.gz


## 解包
tar -xvf aa.tar		 								 # 将aa.tar文件进行解包，并将解包后的文件放在当前目录
tar -zxvf bb.tar.gz	 							 # 将bb.tar.gz文件进行解压，并将解压后的文件放在当前目录
tar -zxvf bb.tar.gz -C /usr/local  # 将bb.tar.gz文件进行解压，并将解压后的文件放在/usr/local目录
```

### vi|vim 文本编辑

- **命令模式**
  - yy 复制当前行; p 粘贴刚才的行
  - dd 删除当前行
  - 快速到达文件的末尾： G
  - 快速到达文件的开始： gg
- **插入模式**
  - 在命令模式下按下[i,a,o]任意一个，可以进入插入模式
  - 在插入模式下按下 ESC 键，回到命令模式
- **底行模式**
  - 在命令模式下按下[:,/]任意一个，可以进入底行模式
  - 通过/方式进入底行模式后，可以对文件内容进行查找 (n: 查找下一个 ; N: 查找上一个)
  - 通过:方式进入底行模式后，可以输入 wq（保存并退出）、q!（不保存退出）、set nu（显示行号）
  - :n ( 定位到第 n 行, 如 :10 就是定位到第 10 行 )

### 在指定目录下查找文件

语法：`find dirName -option fileName`

```bash
find . –name "*.java"		# 在当前目录及其子目录下查找.java结尾文件
find /a –name "*.java"	# 在/a目录及其子目录下查找.java结尾的文件
```

### 从指定文件中查找指定的文本内容

语法：`grep word fileName`

```bash
grep hello aa.java	# 查找aa.java文件中出现的hello字符串的位置
grep hello *.java		# 查找当前目录中所有.java结尾的文件中包含hello字符串的位置
grep -r hello ./    # 递归当前目录下，包含 test 关键字的文件 (-n 显示行数)
```

### 查看进程(端口)/结束进程

```bash
ps -ef | grep tomcat # 查看端口和进程
kill -9 7742 				 # 结束pid为7742的进程
```

### rpm 软件管理

```bash
rpm -qa | grep mysql  			 # 查看安装过的jdk软件
rpm -e --nodeps 软件名称  # 卸载软件
```

### 防火墙操作

```bash
查看防火墙状态(systemctl status firewalld、firewall-cmd --state)
暂时关闭防火墙(systemctl stop firewalld)
永久关闭防火墙(systemctl disable firewalld)
开启防火墙(systemctl start firewalld)
开放指定端口(firewall-cmd --zone=public --add-port=8080/tcp --permanent)
关闭指定端口(firewall-cmd --zone=public --remove-port=8080/tcp --permanent)
立即生效(firewall-cmd --reload)
查看开放的端口(firewall-cmd --zone=public --list-ports)
```

> **中文编码问题**
> 在执行 Linux 命令时，如果提示信息如果显示为乱码，是由于编码问题导致，只需要修改 Linux 的编码即可，命令如下：
>
> ```bash
> echo 'LANG="en_US.UTF-8"' >> /etc/profile
> source /etc/profile
> ```
>
> **查看一个命令的参数|选项|具体信息**
>
> ```bash
> man ls
> ```
