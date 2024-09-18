## 3.安装配置nginx
### 3.1 
vi /etc/yum.repos.d/nginx.repo
```js
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/7/$basearch/
gpgcheck=0
enabled=1
```

```js
yum install nginx -y 安装nginx
nginx -v 查看安装的版本
nginx -V 查看编译时的参数

/bin/systemctl start nginx.service
nginx -s reload
```

## 4. mysql
- [mysql](https://blog.csdn.net/qq_36582604/article/details/80526287)

```js
wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm
yum -y install mysql57-community-release-el7-10.noarch.rpm
yum -y install mysql-community-server
systemctl start  mysqld.service
systemctl status mysqld.service
grep "password" /var/log/mysqld.log
mysql -uroot -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'PrWB460pA<Qu';
grant all privileges on *.* to 'root'@'*' identified by 'PrWB460pA<Qu' with grant option;
CREATE DATABASE IF NOT EXISTS platform DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
flush privileges
exit
firewall-cmd --zone=public --add-port=3306/tcp --permanent
firewall-cmd --zone=public --add-port=8080/tcp --permanent
firewall-cmd --reload
```

## 5. redis

```js
yum install redis -y
/bin/systemctl  start  redis.service
```

## 6. 安装node
```js
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
https://github.com/nvm-sh/nvm
$ . /root/.bashrc
$ nvm ls-remote
$ nvm install v12.18.0
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
$ 查看源 npm config get registry
$ 切换源 npm config set registry https://registry.npm.taobao.org

yarn config set registry https://registry.npm.taobao.org -g
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g
```



## 7. fee
```js
yum install gcc gcc-c++ gdb autoconf automake -y
yum install librdkafka-devel -y
```

```js
git clone https://github.com/LianjiaTech/fee.git
wget http://img.zhufengpeixun.cn/fee.zip
```


```
https://www.nuget.org/downloads

```

server目录
```js
cd server
npm install
npm run watch
npm run fee Utils:TemplateSQL 
node dist/fee.js Utils:TemplateSQL
```

client目录 
```js
cnpm install
npm run build
cp -f dist/* /usr/share/nginx/monitor/
```

```js
error_log  /var/log/nginx/error.log warn;
log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
access_log  /var/log/nginx/access.log  main;

include /etc/nginx/conf.d/*.conf;
```

```js
server {
    listen       80;
    server_name  monitor.zhufengpeixun.cn;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/monitor;
        index  index.html index.htm;
    }
}
```


文件被占用导致操作无法完成怎么办？
https://jingyan.baidu.com/article/948f5924d1c3a2d80ff5f98d.html



```js
 if ($time_iso8601 ~ "^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})") {
        set $year $1;
        set $month $2;
        set $day $3;
        set $hour $4;
        set $minute $5;
    }
    access_log  /var/log/nginx/access/$year$month/$day/$hour/$minute.log  main;
```


```js
$time_local	-	-	$http_x_real_ip	$http_host	$status	$request_time	$request_length	$body_bytes_sent	15d04347-be16-b9ab-0029-24e4b6645950	-	-	9689c3ea-5155-2df7-a719-e90d2dedeb2c 937ba755-116a-18e6-0735-312cba23b00c	$request	- 	$http_user_agent	-	sample=-&_UC_agent=-&lianjia_device_id=-&-	-	-	-
```




node-gyp，是由于node程序中需要调用一些其他语言编写的 工具 

```js
npm install --global --production windows-build-tools
  python(v2.7 ，3.x不支持);
  visual C++ Build Tools,或者 （vs2015以上（包含15))
  net framework 4.5.1
npm install -g node-gyp
```

```js

node dist/fee.js -h

node dist/fee.js SaveLog:Nginx

CreateCache
node dist/fee.js  CreateCache:UpdatePerOneMinute

Parse
node dist/fee.js Parse:Device "2020-06-12 12:33" "2020-06-12 12:33"
node dist/fee.js Parse:MenuClick "2020-06-11 19:09" "2020-06-11 19:09"
node dist/fee.js Parse:Monitor "2020-06-11 21:05" "2020-06-11 21:05"
node dist/fee.js Parse:Performance "2020-06-11 15:54"   "2020-06-11 15:55"
node dist/fee.js Parse:TimeOnSiteByHour "2020-06-11 19:20"   "2020-06-11 19:20"
node dist/fee.js Parse:UV "2020-06-11 20:06"   "2020-06-11 20:06"
node dist/fee.js Parse:UserFirstLoginAt "2020-06-11 20:06" minute


Summary
node dist/fee.js Summary:Error "2020-06-11 21:05"   minute
node dist/fee.js Summary:HttpError "2020-06-11"   day
node dist/fee.js Summary:NewUser "2020-06-11"   day
node dist/fee.js Summary:Performance "2020-06-11"   day
node dist/fee.js Summary:SystemBrowser "2020-06"   month
node dist/fee.js Summary:SystemDevice "2020-06"   month
node dist/fee.js Summary:SystemOS "2020-06"   month
node dist/fee.js Summary:SystemRuntimeVersion "2020-06"  month
node dist/fee.js Summary:TimeOnSite "2020-06"  month
node dist/fee.js Summary:UV "2020-06-11 19"  hour
node dist/fee.js Summary:UV "2020-06-11"  day
node dist/fee.js Summary:UV "2020-06"  month

Task
node dist/fee.js Task:Manager

node dist/fee.js Utils:CleanOldLog
node dist/fee.js Utils:GenerateSQL
node dist/fee.js Utils:TemplateSQL
node dist/fee.js Utils:Test

WatchDog
node dist/fee.js WatchDog:Alarm
node dist/fee.js WatchDog:Saas
```

```js
 log_format  main '$time_iso8601	-	-	$remote_addr	$http_host	$status	$request_time	$request_length	$body_bytes_sent	15d04347-be16-b9ab-0029-24e4b6645950	-	-	9689c3ea-5155-2df7-a719-e90d2dedeb2c 937ba755-116a-18e6-0735-312cba23b00c	-	-	$request	$http_user_agent	-	sample=-&_UC_agent=-&lianjia_device_id=-&-	-	-	-';
 #access_log  logs/access.log  main;
```

