# Mac 安装 MongoDB 4.x

### 1.下载 mongodb 压缩文件

https://www.mongodb.com/download-center/community

### 2.安装对应路径

1. 将下载后的文件解压，得到类似于`mongodb-macos-x86_64-4.2.10`的文件夹，建议将文件夹改名为 mongodb 。

2. 在访达(finder)窗口执行快捷键 shift + command + G ，输入 /usr/local ，进入该路径。

3. 将解压后的文件夹(mongodb) 移动到该路径下。

### 3. 设置环境变量

打开终端：

1. 输入 open -e .bash_profile ，在打开的文件中加入

```bash
export PATH=${PATH}:/usr/local/mongodb/bin
```

2. Command+S 保存你的更改，关闭.bash_profile 编辑窗口。

3. 执行 source .bash_profile ，使刚才的配置生效。

### 4. 验证

终端执行 `mongod -version`
如果返回了 mongodb 的版本信息，那么证明成功安装了

### 5.新建 data 文件夹

存放数据文件夹安装 mongod 时并不会自动生成，可以在命令行输入创建，也可以直接在 Finder 中手动新建

```bash
sudo mkdir -p /data/db
```

> /data/db

### 6.启动 mongod

启动服务端：`sudo mongod`，服务端会等待客户端来连接

启动客户端：`mongo`。或可视化工具连接服务端

> sudo mongod --auth 需要验证权限

> mongo -u zwh -p 123456 带用户密码登录

> 停止 MongoDB 的时候要正确的退出，不然下次连接数据库可能会出现问题。在客户端中执行
>
> use admin
> db.shutdownServer()
