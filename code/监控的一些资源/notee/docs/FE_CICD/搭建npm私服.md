# 搭建 npm 私服

## 1.npm 私有库的理由

- npm 私有库只针对公司内部局域网开放，不对外部公开，具有一定的保密性
- 速度比在直接在 npm 下载更快，甚至是比淘宝源更快。因为毕竟是在公司局域网
- 对于发布和下载 npm 包配置权限管理
- 私有库能够将包资源进行缓存，响应的话会加快下载速度

## 2.选择 verdaccio 的理由

verdaccio 是一个 **Node.js** 创建的轻量的私有 npm proxy registry，froked 于`sinopia@1.4.0` ,是一个开源的 npm 私有库的搭建工具，可以搭建一套属于自己公司的 npm 仓库。

- 与`yarn` 、`npm` 和`pnmp` 100%兼容
- 提供的 Docker 和 Kubernetes 支持，很容易安装和使用
- 发布的包是私有和配置访问权限
- verdaccio 是需要缓存所有相关项，并且在本地或者私有网络下可以加速安装

[verdaccio 文档](https://verdaccio.org/docs/zh-CN/installation)

## 3.安装 verdaccio

下载之前保证您的`node版本 > 8.x`，`npm版本 > 6.x`

### 3.1 安装 CLI

```bash
npm install -g verdaccio

# 要是报权限错误的话，请选择cmd<以管理员身份运行>在输入一次
```

### 3.2 启动 npm

安装完成后，运行`verdaccio`就是启动服务，能看到`config.yaml`配置文件和 web 管理地址

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/4.8.1
```

> 默认启动服务需要占用 4873 端口，若启动 verdaccio 服务失败请检查该端口是否被占用，或者手动修改对应的配置文件，修改其端口号。

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/19-17-54-Uqd70V.png" alt="屏幕快照 2021-01-02 下午10.38.47" style="zoom:25%;" />

按照地址可以编辑配置文件 `config.yaml`

添加上`listen: 0.0.0.0:4873`，其他机器才能更加 ip 访问到这台机器的私服，否则只有本机能访问

配置完后重启 verdaccio

```yaml
#
# 这是默认的配置文件. 它会允许我们做任何事情,
# 所以不要在生产环境(系统)使用它.
#
# 在这里可以看见更多的配置示例:
# https://github.com/verdaccio/verdaccio/tree/master/conf
#

# 包含所有包的目录路径,npm私服包的存放目录以及缓存地址
storage: ./storage
# 包含plugins的目录路径,默认插件的文件位置，一般只对docker部署有关系
plugins: ./plugins

web: #verdaccio的界面
  title: Verdaccio
  # comment out to disable gravatar support 注释掉gravatar禁止使用
  # gravatar: false
  # by default packages are ordercer ascendant (asc|desc)  默认的packages是准备好的两个选择
  # sort_packages: asc
  # convert your UI to the dark side  用户界面是黑夜模式
  # darkMode: true

# translate your registry, api i18n not available yet  看看下你的注册表，i18n api还不能使用
# i18n:
# list of the available translations 查看可以使用的注册列表的地址：https://github.com/verdaccio/ui/tree/master/i18n/translations
#   web: en-US

auth:
  htpasswd:
    file: ./htpasswd #保存用户的账号信息比如用户名，密码等，还没有注册或者登录的话暂时看不到
    # Maximum amount of users allowed to register, defaults to "+inf".允许注册的最大用户数量，可以是无穷大
    # You can set this to -1 to disable registration. 你可以设置-1去禁止用户通过 npm adduser 去注册
    # max_users: 1000  #默认注册人数最大数量是1000

# a list of other known repositories we can talk to  我们需要了解其他相关有名的存储库
uplinks: #配置上游的npm服务器，主要用于请求的库不存在时可以去到上游服务器去获取，可以多配置下上游链路的链接
  npmjs:
    url: https://registry.npmjs.org/
    agent_options: #代理的配置项
      keepAlive: true
      maxSockets: 40
      maxFreeSockets: 10

packages: # 配置模块,access访问下载权限，pushlish包的发布权限
  '@*/*': # 一种是@/表示某下面所属的某项目,关键字匹配
    # scoped packages   配置权限管理
    access: $all # 表示哪一类用户可以对匹配的项目进行安装(install)和查看包的信息
    publish: $authenticated # 表示哪一类用户可以对匹配的项目进行发布(publish)
    unpublish: $authenticated # 表示哪一类用户可以对匹配的项目进行卸载(publish)
    proxy: npmjs # 这里的值是对应于 uplinks 的名称，如果本地不存在，允许去对应的uplinks去拉取

  '**': # 另一种是*匹配项目名称(名称在package.json中有定义)
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    # 允许所有用户（包括未经身份验证的用户）读取和发布所有包
    # you can specify usernames/groupnames (depending on your auth plugin) 您可以指定用户名/组织名称（取决于验证身份的插件）
    # and three keywords: "$all", "$anonymous", "$authenticated" 三个关键字:所有的,匿名的,验证过的  也可以使用具体的用户名或者组织名称(公司私有的名字)和配置的用户表 htpasswd 有关
    access: $all

    # allow all known users to publish/publish packages 允许所有用户去发布包
    # (anyone can register by default, remember?)  任何人都可以默认注册
    publish: $authenticated
    unpublish: $authenticated

    # if package is not available locally, proxy requests to 'npmjs' registry 如果包不允许在本机使用，可以用proxy请求npmjs注册表的代理
    proxy: npmjs

# You can specify HTTP/1.1 server keep alive timeout in seconds for incoming connections. 传入的指定连接的HTTP/1.1服务器保持活跃状态直到超时，以秒为单位
# A value of 0 makes the http server behave similarly to Node.js versions prior to 8.0.0, which did not have a keep-alive timeout.  值为0的时候的服务表现行为和8.0.0之前版本的nodejs链接的时候没有保持活跃状态导致超时
# WORKAROUND: Through given configuration you can workaround following issue  解决办法：通过已知的配置，你可以解决这些问题: https://github.com/verdaccio/verdaccio/issues/301. Set to 0 in case 60 is not enough.  如果60不够的话可以设置为0
server:
  keepAliveTimeout: 60

middlewares:
  audit:
    enabled: true

# log settings  设置日志
logs:
  - { type: stdout, format: pretty, level: http }
  #- {type: file, path: verdaccio.log, level: info}
#experiments: 实验性的
#  # support for npm token command  支持npm的token令牌
#  token: false
#  # support for the new v1 search endpoint, functional by incomplete read more on ticket 1732
#  search: false
#  # disable writing body size to logs, read more on ticket 1912
#  bytesin_off: false

# This affect the web and api (not developed yet) 这些会影响web和api(尚未开发的功能)
#i18n:
#web: en-US

#默认是没有的，只能在本机访问，添加后可以通过外网访问
listen: 0.0.0.0:4873
```

至此 npm 基础功能已经搭建完成，可以开始使用了。

## 4 设置 npm 私有源

但是每次 npm 操作都要在后面加上 `--registry http://0.0.0.0:4873/` 太麻烦了

我们可以用设置 registry `npm set registry http://0.0.0.0:4873/`

当然最好的方法还是在 nrm 添加源，方便切换。[nrm 的安装和应用](../node.js/npm/nrm的安装和应用.md)

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/20-37-09-xMGsPM.png" alt="屏幕快照 2021-01-09 下午8.36.56" style="zoom:50%;" />

## 5.测试 npm 私有源

我们测试发 npm-test 包，并安装

### 5.1 测试发布包

```bash
# 创建并初始化 npm-test 项目
mkdir npm-test && cd npm-test
npm init -y
```

初始化的 npm-tes 项目，默认指向 index.js 文件，新建一个 index.js 文件

```js
// ---- index.js --------
module.exports.Say = function(name) {
  return 'Hello ' + name;
};
```

注册账号并发布包

```bash
# 登录账号，如果账号不存在就是注册账号
npm adduser

#登录功能，有账号的话直接使用这个
npm login

# //发布包
npm publish
```

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/20-43-47-JQDsww.png" alt="屏幕快照 2021-01-09 下午8.43.17" style="zoom: 50%;" />

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/20-45-37-yXTzby.png" alt="屏幕快照 2021-01-09 下午8.45.26" style="zoom:25%;" />

发布成功，在管理平台也能看到多了一个包

### 5.2 测试安装包

来测试一下刚才发布的包 npm-test 和私服没有的包 mime，mime 会去配置的上游 npm 服务器拉取并缓存下来

```bash
# 创建并初始化 npm-install 项目
mkdir npm-install && cd npm-install
npm init -y

# 安装私服的包和私服没有的包
npm install npm-test mime -S
```

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/20-51-35-x1nIVw.png" alt="屏幕快照 2021-01-09 下午8.51.05" style="zoom:50%;" />

### 5.3 测试删除包

```bash
npm unpublish npm-test --force
```

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/21-00-40-5FhSQk.png" alt="屏幕快照 2021-01-09 下午9.00.09" style="zoom:50%;" />

## 6.通过 pm2 启动 verdaccio

私服程序是要长期存在的，我们最好用 pm2 来启动 verdaccio，如果 verdaccio 发生意外崩掉的话，pm2 会重新启动他

```bash
pm2 start verdaccio
```

```bash
# pm2 基本用法
npm install pm2 -g     				 // 命令行安装 pm2
pm2 start app.js       				 // 启动app.js应用程序
pm2 start app.js  --watch      // 当文件变化时自动重启应用
pm2 list                       // 列表 PM2 启动的所有的应用程序
pm2 monit                      // 显示每个应用程序的CPU和内存占用情况
pm2 logs                       // 显示所有进程日志
pm2 start app.js --name="api"  // 启动应用程序并命名为 "api"
pm2 show [app-name]            // 显示应用程序的所有信息
pm2 logs [app-name]            // 显示指定应用程序的日志
pm2 stop all                   // 停止所有的应用程序
pm2 stop 0                     // 停止 id为 0的指定应用程序
pm2 restart all                // 重启所有应用
pm2 restart 0                  // 重启指定的进程
pm2 delete all                 // 关闭并删除所有应用
pm2 delete 0                   // 删除指定应用程序id为0的
```

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/21-57-10-r5oYJr.png" alt="屏幕快照 2021-01-09 下午9.57.01" style="zoom:50%;" />

## 7.权限管理示例

```bash
auth:
  htpasswd:
    file: ./htpasswd
    # 此配置项可以关闭注册功能
    max_users: -1
    duGroup:
    # 这里可以自定义用户组
    demoPublish: [xiaoming, xiaohong, xiaoli]
    demoUnpublish: [xiaojun, xiaoming]
    testPublish: [xiaoming,xiaojun]

 packages:
     '@demo/*':
         access: $all
         # 针对不同的包，可以指定不同的用户组来满足权限控制
         publish: demoPublish
         unpublish: demoUnpublish
         proxy: npmjs
     'test':
         access: $all
         publish: testPublish
         unpublish: demoUnpublish
         proxy: npmjs
```
