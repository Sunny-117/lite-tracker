# MongoDB 常用指令

### 0.启动 mongod

| MongoDB         | MySql  |
| :-------------- | :----- |
| 数据库          | 数据库 |
| 集合            | 表     |
| 文档(bson 对象) | 行和列 |

启动服务端：`sudo mongod`，服务端会等待客户端来连接

启动客户端：`mongo`。或可视化工具连接服务端

> sudo mongod --auth 需要验证权限

> mongo -u zwh -p 123456 带用户密码登录

> 停止 MongoDB 的时候要正确的退出，不然下次连接数据库可能会出现问题。在客户端中执行
>
> use admin
> db.shutdownServer()

MongoDB 默认是免密的，第一次连接数据库时，可以看到所有的数据。所有初始化需要这几个操作

1. 新建 root 管理权限
2. 在 config 中开启校验功能
3. 用 root 登录，新建普通用户并分配权限给他们

### 1.全局的命令

- Show dbs 显示所有的数据库

```basic
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
school  0.000GB
```

- use school 进入/切换数据库(没有就是创建)

```basic
> use school
switched to db school
```

- db.auth("用户名","密码") 登录(校验)用户，在 use admin 数据库里校验

```basic
> db.auth("root","root")
1
```

如果你对这个数据库没有权限，会提示报错

```basic
> db.auth("zwh","zwh")
Error: Authentication failed.
```

- db.createUser() 创建用户

> {role:"readWrite",db:"school"} 指定权限和数据库

```basic
> db.createUser({user:"root",pwd:"root",roles:["root"]})
Successfully added user: { "user" : "root", "roles" : [ "root" ] }
```

```basic
> db.createUser({user:"zwh",pwd:"zwh",roles:[{role:"readWrite",db:"school"}]})
Successfully added user: {
	"user" : "zwh",
	"roles" : [
		{
			"role" : "readWrite",
			"db" : "school"
		}
	]
}
```

### 2.数据库里的命令

- show collections 显示当前数据库里的集合（school 数据库）

```basic
> show collections
student
```

- db.student.find() 查询 student 集合的数据，没有填查询条件则查找所有

```basic
> db.student.find()
{ "_id" : ObjectId("5f8d480cd69fced4075f7799"), "name" : "zwh", "age" : 18 }
```
