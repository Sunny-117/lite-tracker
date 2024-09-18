# Mac 平台安装 Maven

## 1.下载压缩包

下载对应版本的压缩包,apache-maven-x.x.x-bin.zip

https://dlcdn.apache.org/maven/maven-3/3.3.9/binaries/

解压到一个任意文件夹中中

## 2.配置环境变量

打开终端

```bash
vi ~/.bash_profile
```

把 MAVEN_HOME 添加进环境变量

```bash
export MAVEN_HOME=/Library/Maven/apache-maven-3.3.9
export PATH=$PATH:$MAVEN_HOME/bin
```

使配置生效

```bash
source ~/.bash_profile
```

## 3.配置本地环境

打开 maven 安装目录中 conf/ settings.xml 文件

配置本地仓库

```xml
<localRepository>/Users/zwh/Maven_Repository</localRepository>
```

配置 jar 包下载镜像地址

```xml
<mirror>
  <id>alimaven</id>
  <name>aliyun maven</name>
  <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
  <mirrorOf>central</mirrorOf>
</mirror>
```

# 4.当前项目添加 maven

设置 => Maven

![截屏2022-02-19 下午5.59.31](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/02-20-Vp2JVk.png)

> 另外"新项目默认配置"也可以按照这个设置

# 5.测试安装

```bash
mvn -version

# mvn -v
```

![截屏2022-02-19 下午1.50.20](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/02-19-zRu1Wf.png)

> 完整环境变量
>
> ```bash
> alias mysql=/usr/local/mysql/bin/mysql
> alias mysqladmin=/usr/local/mysql/bin/mysql
>
> JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home
> MYSQL_HOME=/usr/local/mysql
> MAVEN_HOME=/Library/Maven/apache-maven-3.3.9
>
> PATH="$PATH:$JAVA_HOME/bin:$MYSQL_HOME/bin:$MAVEN_HOME/bin"
>
> CLASSPATH=$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar:.
>
> export JAVA_HOME
> export PATH
> export CLASSPATH
> ```
