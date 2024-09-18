# MySql 基本操作

### 登录用户

```bash
mysql -u 用户名 -p #然后回车再输入密码
```

### 修改密码

```bash
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('root');
```

> '用户名'@'本地地址' = PASSWORD('密码')
