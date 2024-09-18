## 配置环境

1. 安装
2. 设置环境变量
3. 设置 dapath（数据路径） logpath（日志路径） 设置开机启动服务
   Mongod.exe 服务端 mongo.exe 客户端

## 构成

1. 数据库
   - db 查询当前在哪个数据库
   - show databases 显示所有的数据库
   - use school 使用某个数据库
   - db.dropDatabase() 删除数据库
2. 集合
   - show collections 显示所有集合
   - db.createCollection() 创建集合
   - db.集合名.drop()删除
   - show collections 显示所有集合
3. 文档
   - 增 insert，删 remove，改 update，查 find
   - db.user.insert()插入数据，默认生成\_id，如果有传 \_id，则使用给定的
   - db.user.updata(arg1, arg2, arg3)
