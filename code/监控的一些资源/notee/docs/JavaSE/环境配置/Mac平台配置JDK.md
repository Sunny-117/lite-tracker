# Mac 平台配置 JDK

## 1.下载 JDK8

https://www.oracle.com/java/technologies/downloads/#java8

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/12-26-ea0KsW.png" alt="截屏2021-12-26 上午11.41.08" style="zoom: 33%;" />

下载完成后直接安装一路 next 直到完成

https://download.oracle.com/otn/java/jdk/11.0.15.1%2B2/d76aabb62f1c47aa8588b9ae5a8a5b46/jdk-11.0.15.1_osx-x64_bin.dmg

## 2.查看 JDK 安装后的路径

在终端输入命令查看 JDK 路径

```bash
/usr/libexec/java_home -V
```

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/12-26-LFDxHF.png" alt="截屏2021-12-26 下午1.16.53" style="zoom:33%;" />

## 3.配置 JDK 环境变量

3.1 编辑`.bash_profile`文件,如果没有会自动创建

```bash
vi ~/.bash_profile
```

3.2 `JAVA_HOME`填上面复制的 JDK 路径

```bash
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home
PATH=$JAVA_HOME/bin:$PATH:.
CLASSPATH=$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar:.
export JAVA_HOME
export PATH
export CLASSPATH
```

按 esc,输入:wq 保存并退出

3.3 输入以下命令使配置文件生效

```bash
source .bash_profile
```

### 4.验证

输入命令检查环境变量的路径，查看是否配置成功

```bash
echo $JAVA_HOME
```

输入命令，查看 JDK 的版本信息

```bash
java -version
```

![截屏2021-12-26 下午1.26.01](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/12-26-I42sOj.png)
