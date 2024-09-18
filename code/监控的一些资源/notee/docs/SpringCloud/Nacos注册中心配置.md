# Nacos 注册中心配置

[Nacos](https://nacos.io/)是阿里巴巴的产品，现在是[SpringCloud](https://spring.io/projects/spring-cloud)中的一个组件。相比[Eureka](https://github.com/Netflix/eureka)功能更加丰富，在国内受欢迎程度较高。

## 1.搭建 Nacos

1.**父工程**的 pom 文件中的`<dependencyManagement>`中引入 SpringCloudAlibaba 的依赖：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alibaba-dependencies</artifactId>
    <version>2.2.6.RELEASE</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```

2.**服务提供者**和**服务消费者**pom 中添加 nacos 客户端依赖

```xml
<!-- nacos客户端依赖 -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

3.**服务提供者**和**服务消费者**application.yml 文件中配置 nacos 服务器地址

```yaml
spring:
  cloud:
  	# 注册 nacos
    nacos:
      server-addr: localhost:8848
```

4.查看 nacos 服务器的`服务管理-服务列表`是否有注册成功的服务(用户:nacos, 密码:nacos )

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-TJxN6r.png" style="zoom: 33%;" />

## 2.Nacos 服务分级存储模型

- 一级是服务，例如 userservice
- 二级是集群，例如杭州或上海
- 三级是实例，例如杭州机房的某台部署了 userservice 的服务器

微服务互相访问时，应该尽可能访问同集群实例，因为本地访问速度更快。当本集群内不可用时，才访问其它集群。

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-ojgQTA.png" style="zoom:50%;" />

## 2.配置实例的集群

**服务提供者**和**服务消费者**application.yml 文件中配置实例的集群

```yaml
spring:
  cloud:
    nacos:
      server-addr: localhost:8848
      discovery:
        cluster-name: SZ # 配置集群名称，也就是机房位置
```

在 nacos 服务器能看到集群分组

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-CxrkS9.png" style="zoom:33%;" />

## 3.同集群优先的负载均衡

默认的`ZoneAvoidanceRule`轮询并不能实现根据同集群优先来实现负载均衡。因此 Nacos 中提供了一个`NacosRule`的实现，可以优先从同集群中挑选实例。

修改**服务消费者**application.yml 文件配置，对某个**服务提供者**指定负载均衡规则

```yaml
userservice:
  ribbon:
    NFLoadBalancerRuleClassName: com.alibaba.cloud.nacos.ribbon.NacosRule # 负载均衡规则
```

## 4.配置权重

服务器设备性能有差异，部分实例所在机器性能较好，另一些较差，我们希望性能好的机器承担更多的用户请求。

但默认情况下 NacosRule 是同集群内随机挑选，不会考虑机器的性能问题。

Nacos 提供了权重配置来控制访问频率，权重越大则访问频率越高。

在 nacos 控制台，找到**服务提供者**的实例列表进行编辑

![image-20220526205107797](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-kdfqTr.png)

> **注意**：如果权重修改为 0，则该实例永远不会被访问

## 5.配置环境隔离

Nacos 提供了 namespace 来实现环境隔离功能。

- nacos 中可以有多个 namespace
- namespace 下可以有 group、service 等
- 不同 namespace 之间相互隔离，例如不同 namespace 的服务互相不可见

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-olavPe.png" style="zoom:50%;" />

#### 创建 namespace

默认情况下，所有 service、data、group 都在同一个 namespace，名为 public，可以点击页面新增按钮，添加一个 namespace：

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-vonzhr.png" alt="image-20210714000414781" style="zoom:50%;" />

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-bZPQet.png" alt="image-20210714000440143" style="zoom: 50%;" />

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-cDonlz.png" alt="image-20210714000505928" style="zoom:50%;" />

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-irIHm6.png" alt="image-20210714000522913" style="zoom:50%;" />

#### 给微服务配置 namespace

要把某些**服务提供者**和**服务消费者**实例添加到命名空间，在对应的 application.yml 文件中配置即可

```yaml
spring:
  cloud:
    nacos:
      server-addr: localhost:8848
      discovery:
        cluster-name: SZ
        namespace: 492a7d5d-237b-46a1-a99a-fa8e98e4b0f9 # 命名空间，填ID(通常空间名和 id 名一致)
```

在控制台，查看结果

![image-20210714000830703](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-RnQ2Hd.png)

## 6.配置非临时实例

Nacos 的服务实例分为两种类型：

- 临时实例：如果实例宕机超过一定时间，会从服务列表剔除，默认的类型。
- 非临时实例：如果实例宕机，不会从服务列表剔除，也可以叫永久实例。

要把某些**服务提供者**和**服务消费者**实例配置非临时实例，在对应的 application.yml 文件中配置即可

```yaml
spring:
  cloud:
    nacos:
      discovery:
        ephemeral: false # 设置为非临时实例
```

## 7.Nacos 与 Eureka 的区别

Nacos 和 Eureka 整体结构类似，服务注册、服务拉取、心跳等待，但是也存在一些差异：

- Nacos 与 eureka 的共同点

  - 都支持服务注册和服务拉取
  - 都支持服务提供者心跳方式做健康检测

- Nacos 与 Eureka 的区别
  - Nacos 支持服务端主动检测提供者状态：临时实例采用心跳模式，非临时实例采用主动检测模式
  - 临时实例心跳不正常会被剔除，非临时实例则不会被剔除
  - Nacos 支持服务列表变更的消息推送模式，服务列表更新更及时
  - Nacos 集群默认采用 AP 方式，当集群中存在非临时实例时，采用 CP 模式；Eureka 采用 AP 方式

![image-20210714001728017](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-vCpki7.png)
