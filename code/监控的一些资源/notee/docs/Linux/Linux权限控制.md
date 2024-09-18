# Linux 权限控制

- Linux 中的权限分为三种 ：读(r)、写(w)、执行(x)

- Linux 文件权限分为三级 : 文件所有者（Owner）、用户组（Group）、其它用户（Other Users）

- 只有文件的所有者和超级用户可以修改文件或目录的权限

- 要执行 Shell 脚本需要有对此脚本文件的执行权限(x)，如果没有则不能执行

> chmod（英文全拼：change mode）命令是控制用户对文件的权限的命令

Linux 系统中权限描述如下:

![image-20210815162945754](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-10-HJhtwm.png)

解析当前脚本的权限情况:

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-10-dLmZoz.png"  style="zoom:80%;" />

chmod 命令可以使用八进制数来指定权限(0 - 代表无 , 1 - 执行 x , 2 - 写 w , 4 - 读 r):

| 值  | 权限           | rwx |
| --- | -------------- | --- |
| 7   | 读 + 写 + 执行 | rwx |
| 6   | 读 + 写        | rw- |
| 5   | 读 + 执行      | r-x |
| 4   | 只读           | r-- |
| 3   | 写 + 执行      | -wx |
| 2   | 只写           | -w- |
| 1   | 只执行         | --x |
| 0   | 无             | --- |

```bash
chmod 777 bootStart.sh   # 为所有用户授予读、写、执行权限
chmod 755 bootStart.sh   # 为文件拥有者授予读、写、执行权限，同组用户和其他用户授予读、执行权限
chmod 210 bootStart.sh   # 为文件拥有者授予写权限，同组用户授予执行权限，其他用户没有任何权限
```

> 三个数字分别代表不同用户的权限
>
> - 第 1 位表示文件拥有者的权限
> - 第 2 位表示同组用户的权限
> - 第 3 位表示其他用户的权限
