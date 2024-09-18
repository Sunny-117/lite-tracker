# Sentinel 服务保护

# 1.初识 Sentinel

## 1.1.雪崩问题及解决方案

### 1.1.1.雪崩问题

微服务中，服务间调用关系错综复杂，一个微服务往往依赖于多个其它微服务。

![1533829099748](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-e55YgX.png)

如图，如果服务提供者 I 发生了故障，当前的应用的部分业务因为依赖于服务 I，因此也会被阻塞。此时，其它不依赖于服务 I 的业务似乎不受影响。

![1533829198240](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-05-APKRzx.png)

但是，依赖服务 I 的业务请求被阻塞，用户不会得到响应，则 tomcat 的这个线程不会释放，于是越来越多的用户请求到来，越来越多的线程会阻塞：

![1533829307389](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-xtZqka.png)

服务器支持的线程和并发数有限，请求一直阻塞，会导致服务器资源耗尽，从而导致所有其它服务都不可用，那么当前服务也就不可用了。

那么，依赖于当前服务的其它服务随着时间的推移，最终也都会变的不可用，形成级联失败，雪崩就发生了：

![image-20210715172710340](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-Pf0vuM.png)

### 1.1.2.超时处理

解决雪崩问题的常见方式有四种：

•超时处理：设定超时时间，请求超过一定时间没有响应就返回错误信息，不会无休止等待

![image-20210715172820438](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-MAknEZ.png)

### 1.1.3.仓壁模式

方案 2：仓壁模式

仓壁模式来源于船舱的设计：

![image-20210715172946352](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-0pHJ4m.png)

船舱都会被隔板分离为多个独立空间，当船体破损时，只会导致部分空间进入，将故障控制在一定范围内，避免整个船体都被淹没。

于此类似，我们可以限定每个业务能使用的线程数，避免耗尽整个 tomcat 的资源，因此也叫线程隔离。

![image-20210715173215243](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-EiqG25.png)

### 1.1.4.断路器

断路器模式：由**断路器**统计业务执行的异常比例，如果超出阈值则会**熔断**该业务，拦截访问该业务的一切请求。

断路器会统计访问某个服务的请求数量，异常比例：

![image-20210715173327075](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-t2J8Mh.png)

当发现访问服务 D 的请求异常比例过高时，认为服务 D 有导致雪崩的风险，会拦截访问服务 D 的一切请求，形成熔断：

![image-20210715173428073](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-aWzyjd.png)

### 1.1.5.限流

**流量控制**：限制业务访问的 QPS，避免服务因流量的突增而故障。

![image-20210715173555158](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-OWlP8x.png)

### 1.1.6.总结

什么是雪崩问题？

- 微服务之间相互调用，因为调用链中的一个服务故障，引起整个链路都无法访问的情况。

可以认为：

**限流**是对服务的保护，避免因瞬间高并发流量而导致服务故障，进而避免雪崩。是一种**预防**措施。

**超时处理、线程隔离、降级熔断**是在部分服务故障时，将故障控制在一定范围，避免雪崩。是一种**补救**措施。

## 1.2.服务保护技术对比

在 SpringCloud 当中支持多种服务保护技术：

- [Netfix Hystrix](https://github.com/Netflix/Hystrix)
- [Sentinel](https://github.com/alibaba/Sentinel)
- [Resilience4J](https://github.com/resilience4j/resilience4j)

早期比较流行的是 Hystrix 框架，但目前国内实用最广泛的还是阿里巴巴的 Sentinel 框架，这里我们做下对比：

官方地址如下：

```html
https://github.com/alibaba/Sentinel/wiki/Guideline:-%E4%BB%8E-Hystrix-%E8%BF%81%E7%A7%BB%E5%88%B0-Sentinel
```

![1645710445205](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-05-4sOVev.png)

## 1.3.Sentinel 介绍和安装

### 1.3.1.初识 Sentinel

Sentinel 是阿里巴巴开源的一款微服务流量控制组件。官网地址：https://sentinelguard.io/zh-cn/index.html

Sentinel 具有以下特征:

•**丰富的应用场景**：Sentinel 承接了阿里巴巴近 10 年的双十一大促流量的核心场景，例如秒杀（即突发流量控制在系统容量可以承受的范围）、消息削峰填谷、集群流量控制、实时熔断下游不可用应用等。

•**完备的实时监控**：Sentinel 同时提供实时的监控功能。您可以在控制台中看到接入应用的单台机器秒级数据，甚至 500 台以下规模的集群的汇总运行情况。

•**广泛的开源生态**：Sentinel 提供开箱即用的与其它开源框架/库的整合模块，例如与 Spring Cloud、Dubbo、gRPC 的整合。您只需要引入相应的依赖并进行简单的配置即可快速地接入 Sentinel。

•**完善的** **SPI** **扩展点**：Sentinel 提供简单易用、完善的 SPI 扩展接口。您可以通过实现扩展接口来快速地定制逻辑。例如定制规则管理、适配动态数据源等。

**sentinel 的组成部分**：

![1645261217132](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-LeIPHa.png)

![1645261815777](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-ynh2Zn.png)

### 1.3.2.安装 Sentinel

1）下载

sentinel 官方提供了 UI 控制台，方便我们对系统做限流设置。大家可以在[GitHub](https://github.com/alibaba/Sentinel/releases)下载。

[sentinel-dashboard-1.8.1.jar](https://zwhid.oss-cn-shenzhen.aliyuncs.com/soft/sentinel-dashboard-1.8.1.jar)

2）运行

【最好】将 jar 包放到任意非中文目录，执行命令：

```sh
java -jar sentinel-dashboard-1.8.1.jar
```

如果要修改 Sentinel 的默认端口、账户、密码，可以通过下列配置：

| **配置项**                       | **默认值** | **说明**   |
| -------------------------------- | ---------- | ---------- |
| server.port                      | 8080       | 服务端口   |
| sentinel.dashboard.auth.username | sentinel   | 默认用户名 |
| sentinel.dashboard.auth.password | sentinel   | 默认密码   |

例如，修改端口：

```sh
java -Dserver.port=8090 -jar sentinel-dashboard-1.8.1.jar
```

3）访问

访问http://localhost:8080页面，就可以看到sentinel的控制台了：

![image-20210715190827846](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-Jzw8Sv.png)

需要输入账号和密码，默认都是：sentinel

登录后，发现一片空白，什么都没有：

![image-20210715191134448](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-PnhHYf.png)

这是因为还没有与微服务整合。

## 1.4.微服务整合 Sentinel

在 order-service 中整合 sentinel，并连接 sentinel 的控制台，步骤如下：

1）引入 sentinel 依赖

```xml
<!--sentinel-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

2）配置控制台

order-service 中修改 application.yaml 文件，添加下面内容：

```yaml
server:
  port: 8088
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8080
```

3）访问 order-service 的任意端点

打开浏览器，访问http://localhost:8088/order/101，这样才能触发sentinel的监控。

然后再访问 sentinel 的控制台，查看效果：

![image-20210715191241799](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-05-OKbyJp.png)

# 2.流量控制

雪崩问题虽然有四种方案，但是限流是避免服务因突发的流量而发生故障，是对微服务雪崩问题的预防。我们先学习这种模式。

## 2.1.簇点链路

当请求进入微服务时，首先会访问 DispatcherServlet，然后进入 Controller、Service、Mapper，这样的一个调用链就叫做**簇点链路**。簇点链路中被监控的每一个接口就是一个**资源**。

默认情况下 sentinel 会监控 SpringMVC 的每一个端点（Endpoint，也就是 controller 中的方法），因此 SpringMVC 的每一个端点（Endpoint）就是调用链路中的一个资源。

例如，我们刚才访问的 order-service 中的 OrderController 中的端点：/order/{orderId}

![image-20210715191757319](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-leOzg8.png)

流控、熔断等都是针对簇点链路中的资源来设置的，因此我们可以点击对应资源后面的按钮来设置规则：

- 流控：流量控制
- 降级：降级熔断
- 热点：热点参数限流，是限流的一种
- 授权：请求的权限控制

## 2.1.快速入门

### 2.1.1.示例

点击资源/order/{orderId}后面的流控按钮，就可以弹出表单。

![image-20210715191757319](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-leOzg8.png)

表单中可以填写限流规则，如下：

![image-20210715192010657](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-CoL0qn.png)

其含义是限制 /order/{orderId}这个资源的单机 QPS 为 1，即每秒只允许 1 次请求，超出的请求会被拦截并报错。

## 2.2.流控模式

在添加限流规则时，点击高级选项，可以选择三种**流控模式**：

- 直接：统计当前资源的请求，触发阈值时对当前资源直接限流，也是默认的模式
- 关联：统计与当前资源相关的另一个资源，触发阈值时，对当前资源限流
- 链路：统计从指定链路访问到本资源的请求，触发阈值时，对指定链路限流

![image-20210715201827886](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-5b3O76.png)

快速入门测试的就是直接模式。

### 2.2.1.关联模式

**关联模式**：统计与当前资源相关的另一个资源，触发阈值时，对当前资源限流

**配置规则**：

![image-20210715202540786](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-w5iTG5.png)

**语法说明**：当/write 资源访问量触发阈值时，就会对/read 资源限流，避免影响/write 资源。

**使用场景**：比如用户支付时需要修改订单状态，同时用户要查询订单。查询和修改操作会争抢数据库锁，产生竞争。业务需求是优先支付和更新订单的业务，因此当修改订单业务触发阈值时，需要对查询订单业务限流。

**需求步骤说明**：

- 在 OrderController 新建两个端点：/order/query 和/order/update，无需实现业务

- 配置流控规则，当/order/ update 资源被访问的 QPS 超过 5 时，对/order/query 请求限流

1）定义/order/query 端点，模拟订单查询

```java
@GetMapping("/query")
public String queryOrder() {
    return "查询订单成功";
}
```

2）定义/order/update 端点，模拟订单更新

```java
@GetMapping("/update")
public String updateOrder() {
    return "更新订单成功";
}
```

重启服务，查看 sentinel 控制台的簇点链路：

![image-20210716101805951](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-niGiQu.png)

3）配置流控规则

对哪个端点限流，就点击哪个端点后面的按钮。我们是对订单查询/order/query 限流，因此点击它后面的按钮：

![image-20210716101934499](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-NV4C7O.png)

在表单中填写流控规则：

![image-20210716102103814](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-cajVGR.png)

4）总结

![image-20210716103143002](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-aLIJhh.png)

### 2.2.2.链路模式

**链路模式**：只针对从指定链路访问到本资源的请求做统计，判断是否超过阈值。

**配置示例**：

例如有两条请求链路：

- /test1 --> /common

- /test2 --> /common

如果只希望统计从/test2 进入到/common 的请求，则可以这样配置：

![image-20210716103536346](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-cT4F8y.png)

**实战案例**

需求：有查询订单和创建订单业务，两者都需要查询商品。针对从查询订单进入到查询商品的请求统计，并设置限流。

步骤：

1. 在 OrderService 中添加一个 queryGoods 方法，不用实现业务

2. 在 OrderController 中，改造/order/query 端点，调用 OrderService 中的 queryGoods 方法

3. 在 OrderController 中添加一个/order/save 的端点，调用 OrderService 的 queryGoods 方法

4. 给 queryGoods 设置限流规则，从/order/query 进入 queryGoods 的方法限制 QPS 必须小于 2

实现：

#### 1）添加查询商品方法

在 order-service 服务中，给 OrderService 类添加一个 queryGoods 方法：

```java
public void queryGoods(){
    System.err.println("查询商品");
}
```

#### 2）查询订单时，查询商品

在 order-service 的 OrderController 中，修改/order/query 端点的业务逻辑：

```java
@GetMapping("/query")
public String queryOrder() {
    // 查询商品
    orderService.queryGoods();
    // 查询订单
    System.out.println("查询订单");
    return "查询订单成功";
}
```

#### 3）新增订单，查询商品

在 order-service 的 OrderController 中，修改/order/save 端点，模拟新增订单：

```java
@GetMapping("/save")
public String saveOrder() {
    // 查询商品
    orderService.queryGoods();
    // 查询订单
    System.err.println("新增订单");
    return "新增订单成功";
}
```

#### 4）给查询商品添加资源标记

默认情况下，OrderService 中的方法是不被 Sentinel 监控的，需要我们自己通过注解来标记要监控的方法。

给 OrderService 的 queryGoods 方法添加@SentinelResource 注解：

```java
@SentinelResource("goods")
public void queryGoods(){
    System.err.println("查询商品");
}
```

链路模式中，是对不同来源的两个链路做监控。但是 sentinel 默认会给进入 SpringMVC 的所有请求设置同一个 root 资源，会导致链路模式失效。

我们需要关闭这种对 SpringMVC 的资源聚合，修改 order-service 服务的 application.yml 文件：

```yaml
spring:
  cloud:
    sentinel:
      web-context-unify: false # 关闭context整合
```

重启服务，访问/order/query 和/order/save，可以查看到 sentinel 的簇点链路规则中，出现了新的资源：

![image-20210716105227163](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-QQjn0f.png)

#### 5）添加流控规则

点击 goods 资源后面的流控按钮，在弹出的表单中填写下面信息：

![image-20210716105408723](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-aUeMQT.png)

只统计从/order/query 进入/goods 的资源，QPS 阈值为 2，超出则被限流。

### 2.2.3.总结

流控模式有哪些？

•直接：对当前资源限流

•关联：高优先级资源触发阈值，对低优先级资源限流。

•链路：阈值统计时，只统计从指定资源进入当前资源的请求，是对请求来源的限流

## 2.3.流控效果

在流控的高级选项中，还有一个流控效果选项：

![image-20210716110225104](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-txhbUt.png)

流控效果是指请求达到流控阈值时应该采取的措施，包括三种：

- 快速失败：达到阈值后，新的请求会被立即拒绝并抛出 FlowException 异常。是默认的处理方式。

- warm up：预热模式，对超出阈值的请求同样是拒绝并抛出异常。但这种模式阈值会动态变化，从一个较小值逐渐增加到最大阈值。

- 排队等待：让所有的请求按照先后次序排队执行，两个请求的间隔不能小于指定时长

### 2.3.1.warm up

阈值一般是一个微服务能承担的最大 QPS，但是一个服务刚刚启动时，一切资源尚未初始化（**冷启动**），如果直接将 QPS 跑到最大值，可能导致服务瞬间宕机。

warm up 也叫**预热模式**，是应对服务冷启动的一种方案。请求阈值初始值是 maxThreshold / coldFactor，持续指定时长后，逐渐提高到 maxThreshold 值。而 coldFactor 的默认值是 3.

例如，我设置 QPS 的 maxThreshold 为 10，预热时间为 5 秒，那么初始阈值就是 10 / 3 ，也就是 3，然后在 5 秒后逐渐增长到 10.

![image-20210716110629796](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-CvLbc9.png)

**案例**

需求：给/order/{orderId}这个资源设置限流，最大 QPS 为 10，利用 warm up 效果，预热时长为 5 秒

#### 1）配置流控规则：

![](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-PsEsD5.png)

到 Sentinel 控制台查看实时监控：

![](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-agOpaq.png)

一段时间后：

![](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-YvCz2y.png)

### 2.3.2.排队等待

当请求超过 QPS 阈值时，快速失败和 warm up 会拒绝新的请求并抛出异常。

而排队等待则是让所有请求进入一个队列中，然后按照阈值允许的时间间隔依次执行。后来的请求必须等待前面执行完成，如果请求预期的等待时间超出最大时长，则会被拒绝。

工作原理

例如：QPS = 5，意味着每 200ms 处理一个队列中的请求；timeout = 2000，意味着**预期等待时长**超过 2000ms 的请求会被拒绝并抛出异常。

那什么叫做预期等待时长呢？

比如现在一下子来了 12 个请求，因为每 200ms 执行一个请求，那么：

- 第 6 个请求的**预期等待时长** = 200 \* （6 - 1） = 1000ms
- 第 12 个请求的预期等待时长 = 200 \* （12-1） = 2200ms

现在，第 1 秒同时接收到 10 个请求，但第 2 秒只有 1 个请求，此时 QPS 的曲线这样的：

![image-20210716113147176](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-tQpS2G.png)

如果使用队列模式做流控，所有进入的请求都要排队，以固定的 200ms 的间隔执行，QPS 会变的很平滑：

![image-20210716113426524](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-GroJNo.png)

平滑的 QPS 曲线，对于服务器来说是更友好的。

**案例**

需求：给/order/{orderId}这个资源设置限流，最大 QPS 为 10，利用排队的流控效果，超时时长设置为 5s

#### 1）添加流控规则

![image-20210716114048918](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-05-FcxVrt.png)

#### 2）Jmeter 测试

选择《流控效果，队列》：

![image-20210716114243558](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-rGQJZ2.png)

QPS 为 15，已经超过了我们设定的 10。

如果是之前的 快速失败、warmup 模式，超出的请求应该会直接报错。

但是我们看看队列模式的运行结果：

![image-20210716114429361](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-qVVyhK.png)

全部都通过了。

再去 sentinel 查看实时监控的 QPS 曲线：

![image-20210716114522935](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-8bVzEf.png)

QPS 非常平滑，一致保持在 10，但是超出的请求没有被拒绝，而是放入队列。因此**响应时间**（等待时间）会越来越长。

当队列满了以后，才会有部分请求失败：

![image-20210716114651137](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-05-8VjBNN.png)

### 2.3.3.总结

流控效果有哪些？

- 快速失败：QPS 超过阈值时，拒绝新的请求

- warm up： QPS 超过阈值时，拒绝新的请求；QPS 阈值是逐渐提升的，可以避免冷启动时高并发导致服务宕机。

- 排队等待：请求会进入队列，按照阈值允许的时间间隔依次执行请求；如果请求预期等待时长大于超时时间，直接拒绝

## 2.4.热点参数限流

之前的限流是统计访问某个资源的所有请求，判断是否超过 QPS 阈值。而热点参数限流是**分别统计参数值相同的请求**，判断是否超过 QPS 阈值。

### 2.4.1.全局参数限流

例如，一个根据 id 查询商品的接口：

![image-20210716115014663](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-p4ev7Q.png)

访问/goods/{id}的请求中，id 参数值会有变化，热点参数限流会根据参数值分别统计 QPS，统计结果：

![image-20210716115131463](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-SfMuft.png)

当 id=1 的请求触发阈值被限流时，id 值不为 1 的请求不受影响。

配置示例：

![image-20210716115232426](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-a9DIRv.png)

代表的含义是：对 hot 这个资源的 0 号参数（第一个参数）做统计，每 1 秒**相同参数值**的请求数不能超过 5

### 2.4.2.热点参数限流

刚才的配置中，对查询商品这个接口的所有商品一视同仁，QPS 都限定为 5.

而在实际开发中，可能部分商品是热点商品，例如秒杀商品，我们希望这部分商品的 QPS 限制与其它商品不一样，高一些。那就需要配置热点参数限流的高级选项了：

![image-20210716115717523](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-rH5jzG.png)

结合上一个配置，这里的含义是对 0 号的 long 类型参数限流，每 1 秒相同参数的 QPS 不能超过 5，有两个例外：

•如果参数值是 100，则每 1 秒允许的 QPS 为 10

•如果参数值是 101，则每 1 秒允许的 QPS 为 15

### 2.4.4.案例

**案例需求**：给/order/{orderId}这个资源添加热点参数限流，规则如下：

•默认的热点参数规则是每 1 秒请求量不超过 2

•给 102 这个参数设置例外：每 1 秒请求量不超过 4

•给 103 这个参数设置例外：每 1 秒请求量不超过 10

**注意事项**：热点参数限流对默认的 SpringMVC 资源无效，需要利用@SentinelResource 注解标记资源

#### 1）标记资源

给 order-service 中的 OrderController 中的/order/{orderId}资源添加注解：

![image-20210716120033572](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-BAFcyo.png)

#### 2）热点参数限流规则

访问该接口，可以看到我们标记的 hot 资源出现了：

![image-20210716120208509](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-cCVi2y.png)

这里不要点击 hot 后面的按钮，页面有 BUG

点击左侧菜单中**热点规则**菜单：

![image-20210716120319009](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-fbwxTU.png)

点击新增，填写表单：

![image-20210716120536714](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-VjUe1e.png)

#### 3）Jmeter 测试

选择《热点参数限流 QPS1》：

![image-20210716120754527](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-i9QOri.png)

这里发起请求的 QPS 为 5.

包含 3 个 http 请求：

普通参数，QPS 阈值为 2

![image-20210716120840501](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-QWSjiF.png)

运行结果：

![image-20210716121105567](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-goSam5.png)

例外项，QPS 阈值为 4

![image-20210716120900365](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-nSDC5Q.png)

运行结果：

![image-20210716121201630](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-lDrUb2.png)

例外项，QPS 阈值为 10

![image-20210716120919131](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-MoznSO.png)

运行结果：

![image-20210716121220305](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-PGljz9.png)

# 3.隔离和降级

限流是一种预防措施，虽然限流可以尽量避免因高并发而引起的服务故障，但服务还会因为其它原因而故障。

而要将这些故障控制在一定范围，避免雪崩，就要靠**线程隔离**（舱壁模式）和**熔断降级**手段了。

**线程隔离**之前讲到过：调用者在调用服务提供者时，给每个调用的请求分配独立线程池，出现故障时，最多消耗这个线程池内资源，避免把调用者的所有资源耗尽。

![image-20210715173215243](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-EiqG25.png)

**熔断降级**：是在调用方这边加入断路器，统计对服务提供者的调用，如果调用的失败比例过高，则熔断该业务，不允许访问该服务的提供者了。

![image-20210715173428073](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-aWzyjd.png)

可以看到，不管是线程隔离还是熔断降级，都是对**客户端**（调用方）的保护。需要在**调用方** 发起远程调用时做线程隔离、或者服务熔断。

而我们的微服务远程调用都是基于 Feign 来完成的，因此我们需要将 Feign 与 Sentinel 整合，在 Feign 里面实现线程隔离和服务熔断。

## 3.1.FeignClient 整合 Sentinel

SpringCloud 中，微服务调用都是通过 Feign 来实现的，因此做客户端保护必须整合 Feign 和 Sentinel。

### 3.1.1.修改配置，开启 sentinel 功能

修改 OrderService 的 application.yml 文件，开启 Feign 的 Sentinel 功能：

```yaml
feign:
  sentinel:
    enabled: true # 开启feign对sentinel的支持
```

### 3.1.2.编写失败降级逻辑

业务失败后，不能直接报错，而应该返回用户一个友好提示或者默认结果，这个就是失败降级逻辑。

给 FeignClient 编写失败后的降级逻辑

① 方式一：Fallback，无法对远程调用的异常做处理

② 方式二：FallbackFactory，可以对远程调用的异常做处理，我们选择这种

这里我们演示方式二的失败降级处理。

**步骤一**：在 feing-api 项目中定义类，实现 FallbackFactory：

![image-20210716122403502](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-YqKlB5.png)

代码：

```java
@Slf4j
public class UserClientFallbackFactory implements FallbackFactory<UserClient> {
    @Override
    public UserClient create(Throwable throwable) {
        return new UserClient() {
            @Override
            public User findById(Long id) {
                log.error("查询用户异常", throwable);
                return new User();
            }
        };
    }
}

```

**步骤二**：在 feing-api 项目中的 DefaultFeignConfiguration 类中将 UserClientFallbackFactory 注册为一个 Bean：

```java
@Bean
public UserClientFallbackFactory userClientFallbackFactory(){
    return new UserClientFallbackFactory();
}
```

**步骤三**：在 feing-api 项目中的 UserClient 接口中使用 UserClientFallbackFactory：

```java
@FeignClient(value = "userservice", fallbackFactory = UserClientFallbackFactory.class)
public interface UserClient {

    @GetMapping("/user/{id}")
    User findById(@PathVariable("id") Long id);
}
```

测试：重启 order 微服务，访问订单查询，并停止 user 微服务，再测试一次，发现效果即可。可以访问一次订单查询业务，然后查看 sentinel 控制台，可以看到新的簇点链路：

![image-20210716123705780](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-FMM5J2.png)

### 3.1.3.总结

Sentinel 支持的雪崩解决方案：

- 线程隔离（仓壁模式）
- 降级熔断

Feign 整合 Sentinel 的步骤：

- 在 application.yml 中配置：feign.sentienl.enable=true
- 给 FeignClient 编写 FallbackFactory 并注册为 Bean
- 将 FallbackFactory 配置到 FeignClient

## 3.2.线程隔离（舱壁模式）

### 3.2.1.线程隔离的实现方式

线程隔离有两种方式实现：

- 线程池隔离

- 信号量隔离（Sentinel 默认采用）

如图：

![image-20210716123036937](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-ZT4CNq.png)

**线程池隔离**：给每个服务调用业务分配一个线程池，利用线程池本身实现隔离效果

**信号量隔离**：不创建线程池，而是计数器模式，记录业务使用的线程数量，达到信号量上限时，禁止新的请求。

两者的优缺点：

![image-20210716123240518](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-MsgDlu.png)

### 3.2.2.sentinel 的线程隔离

**用法说明**：

在添加限流规则时，可以选择两种阈值类型：

![image-20210716123411217](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-51NGOk.png)

- QPS：就是每秒的请求数，在快速入门中已经演示过

- 线程数：是该资源能使用用的 tomcat 线程数的最大值。也就是通过限制线程数量，实现**线程隔离**（舱壁模式）。

**案例需求**：给 order-service 服务中的 UserClient 的查询用户接口设置流控规则，线程数不能超过 2。然后利用 jemeter 测试。

#### 1）配置隔离规则

选择 feign 接口后面的流控按钮：

![image-20210716123831992](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-iNBHZl.png)

填写表单：

![image-20210716123936844](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-Eb3kqR.png)

#### 2）Jmeter 测试

选择《阈值类型-线程数<2》：

![image-20210716124229894](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-EQRO12.png)

一次发生 10 个请求，有较大概率并发线程数超过 2，而超出的请求会走之前定义的失败降级逻辑。

查看运行结果：

![image-20210716124147820](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-ump7Yf.png)

发现虽然结果都是通过了，不过部分请求得到的响应是降级返回的 null 信息。

### 3.2.3.总结

线程隔离的两种手段是？

- 信号量隔离

- 线程池隔离

信号量隔离的特点是？

- 基于计数器模式，简单，开销小

线程池隔离的特点是？

- 基于线程池模式，有额外开销，但隔离控制更强

## 3.3.熔断降级

熔断降级是解决雪崩问题的重要手段。其思路是由**断路器**统计服务调用的异常比例、慢请求比例，如果超出阈值则会**熔断**该服务。即拦截访问该服务的一切请求；而当服务恢复时，断路器会放行访问该服务的请求。

断路器控制熔断和放行是通过状态机来完成的：

![image-20210716130958518](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-mbeX6j.png)

状态机包括三个状态：

- closed：关闭状态，断路器放行所有请求，并开始统计异常比例、慢请求比例。超过阈值则切换到 open 状态
- open：打开状态，服务调用被**熔断**，访问被熔断服务的请求会被拒绝，快速失败，直接走降级逻辑。Open 状态 5 秒后会进入 half-open 状态
- half-open：半开状态，放行一次请求，根据执行结果来判断接下来的操作。
  - 请求成功：则切换到 closed 状态
  - 请求失败：则切换到 open 状态

断路器熔断策略有三种：慢调用、异常比例、异常数

### 3.3.1.慢调用

**慢调用**：业务的响应时长（RT）大于指定时长的请求认定为慢调用请求。在指定时间内，如果请求数量超过设定的最小数量，慢调用比例大于设定的阈值，则触发熔断。

例如：

![image-20210716145934347](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-QkF3vm.png)

解读：RT 超过 500ms 的调用是慢调用，统计最近 10000ms 内的请求，如果请求量超过 10 次，并且慢调用比例不低于 0.5，则触发熔断，熔断时长为 5 秒。然后进入 half-open 状态，放行一次请求做测试。

**案例**

需求：给 UserClient 的查询用户接口设置降级规则，慢调用的 RT 阈值为 50ms，统计时间为 1 秒，最小请求数量为 5，失败阈值比例为 0.4，熔断时长为 5

#### 1）设置慢调用

修改 user-service 中的/user/{id}这个接口的业务。通过休眠模拟一个延迟时间：

![image-20210716150234787](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-6Dlagj.png)

此时，orderId=101 的订单，关联的是 id 为 1 的用户，调用时长为 60ms：

![image-20210716150510956](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-EAitEo.png)

orderId=102 的订单，关联的是 id 为 2 的用户，调用时长为非常短；

![image-20210716150605208](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-JUcekP.png)

#### 2）设置熔断规则

下面，给 feign 接口设置降级规则：

![image-20210716150654094](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-B7Evix.png)

规则：

![image-20210716150740434](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-GtvUNd.png)

超过 50ms 的请求都会被认为是慢请求

#### 3）测试

在浏览器访问：http://localhost:8088/order/101，快速刷新5次，可以发现：

![image-20210716150911004](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-TBk4LZ.png)

触发了熔断，请求时长缩短至 5ms，快速失败了，并且走降级逻辑，返回的 null

在浏览器访问：http://localhost:8088/order/102，竟然也被熔断了：

![image-20210716151107785](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-I7knag.png)

### 3.3.2.异常比例、异常数

**异常比例或异常数**：统计指定时间内的调用，如果调用次数超过指定请求数，并且出现异常的比例达到设定的比例阈值（或超过指定异常数），则触发熔断。

例如，一个异常比例设置：

![image-20210716131430682](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-V9LpHZ.png)

解读：统计最近 1000ms 内的请求，如果请求量超过 10 次，并且异常比例不低于 0.4，则触发熔断。

一个异常数设置：

![image-20210716131522912](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-kw5oUF.png)

解读：统计最近 1000ms 内的请求，如果请求量超过 10 次，并且异常比例不低于 2 次，则触发熔断。

**案例**

需求：给 UserClient 的查询用户接口设置降级规则，统计时间为 1 秒，最小请求数量为 5，失败阈值比例为 0.4，熔断时长为 5s

#### 1）设置异常请求

首先，修改 user-service 中的/user/{id}这个接口的业务。手动抛出异常，以触发异常比例的熔断：

![image-20210716151348183](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-Ka8O6e.png)

也就是说，id 为 2 时，就会触发异常

#### 2）设置熔断规则

下面，给 feign 接口设置降级规则：

![image-20210716150654094](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-B7Evix.png)

规则：

![image-20210716151538785](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-mwsSvU.png)

在 5 次请求中，只要异常比例超过 0.4，也就是有 2 次以上的异常，就会触发熔断。

#### 3）测试

在浏览器快速访问：http://localhost:8088/order/102，快速刷新5次，触发熔断：

![image-20210716151722916](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-1317T5.png)

此时，我们去访问本来应该正常的 103：

![image-20210716151844817](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-V6ARRw.png)

# 4.授权规则

授权规则可以对请求方来源做判断和控制。

## 4.1.授权规则

### 4.1.1.基本规则

授权规则可以对调用方的来源做控制，有白名单和黑名单两种方式。

- 白名单：来源（origin）在白名单内的调用者允许访问

- 黑名单：来源（origin）在黑名单内的调用者不允许访问

点击左侧菜单的授权，可以看到授权规则：

![image-20210716152010750](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-WSBEMr.png)

- 资源名：就是受保护的资源，例如/order/{orderId}

- 流控应用：是来源者的名单，
  - 如果是勾选白名单，则名单中的来源被许可访问。
  - 如果是勾选黑名单，则名单中的来源被禁止访问。

比如：

![image-20210716152349191](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-lfXor4.png)

我们允许请求从 gateway 到 order-service，不允许浏览器访问 order-service，那么白名单中就要填写**网关的来源名称（origin）**。

### 4.1.2.如何获取 origin

Sentinel 是通过 RequestOriginParser 这个接口的 parseOrigin 来获取请求的来源的。

```java
public interface RequestOriginParser {
    /**
     * 从请求request对象中获取origin，获取方式自定义
     */
    String parseOrigin(HttpServletRequest request);
}
```

这个方法的作用就是从 request 对象中，获取请求者的 origin 值并返回。

默认情况下，sentinel 不管请求者从哪里来，返回值永远是 default，也就是说一切请求的来源都被认为是一样的值 default。

因此，我们需要自定义这个接口的实现，让**不同的请求，返回不同的 origin**。

例如 order-service 服务中，我们定义一个 RequestOriginParser 的实现类：

```java
package com.zwh.order.sentinel;

@Component
public class HeaderOriginParser implements RequestOriginParser {
    @Override
    public String parseOrigin(HttpServletRequest request) {
        // 1.获取请求头
        String origin = request.getHeader("origin");
        // 2.非空判断
        if (StringUtils.isEmpty(origin)) {
            origin = "blank";
        }
        return origin;
    }
}
```

我们会尝试从 request-header 中获取 origin 值。

### 4.1.3.给网关添加请求头

既然获取请求 origin 的方式是从 reques-header 中获取 origin 值，我们必须让**所有从 gateway 路由到微服务的请求都带上 origin 头**。

这个需要利用之前学习的一个 GatewayFilter 来实现，AddRequestHeaderGatewayFilter。

修改 gateway 服务中的 application.yml，添加一个 defaultFilter：

```yaml
spring:
  cloud:
    gateway:
      default-filters:
        - AddRequestHeader=origin,gateway
      routes:
        # ...略
```

这样，从 gateway 路由的所有请求都会带上 origin 头，值为 gateway。而从其它地方到达微服务的请求则没有这个头。

### 4.1.4.配置授权规则

接下来，我们添加一个授权规则，放行 origin 值为 gateway 的请求。

![image-20210716153250134](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-xV23QJ.png)

配置如下：

![image-20210716153301069](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-x7N0Qm.png)

现在，我们直接跳过网关，访问 order-service 服务：

![image-20210716153348396](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-i7WnC0.png)

通过网关访问：

![image-20210716153434095](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-yWbInx.png)

## 4.2.自定义异常结果返回

默认情况下，发生限流、降级、授权拦截时，sentinel 内部会抛出异常，结果显示到页面上 要么是 500 要么是 flow limmiting（限流）。这样不够友好，无法得知是限流还是降级还是授权拦截。应该可以根据不同的异常类型给页面展示不同的结果。

### 4.2.1.异常类型

而如果要自定义异常时的返回结果，需要实现 BlockExceptionHandler 接口：

```java
public interface BlockExceptionHandler {
    /**
     * 处理请求被限流、降级、授权拦截时抛出的异常：BlockException
     */
    void handle(HttpServletRequest request, HttpServletResponse response, BlockException e) throws Exception;
}
```

这个方法有三个参数：

- HttpServletRequest request：request 对象
- HttpServletResponse response：response 对象
- BlockException e：被 sentinel 拦截时抛出的异常

这里的 BlockException 包含多个不同的子类：

| **异常**             | **说明**           |
| -------------------- | ------------------ |
| FlowException        | 限流异常           |
| ParamFlowException   | 热点参数限流的异常 |
| DegradeException     | 降级异常           |
| AuthorityException   | 授权规则异常       |
| SystemBlockException | 系统规则异常       |

### 4.2.2.自定义异常处理

下面，我们就在 order-service 定义一个自定义异常处理类：

```java
package com.zwh.order.sentinel;

@Component
public class SentinelExceptionHandler implements BlockExceptionHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, BlockException e) throws Exception {
        String msg = "未知异常";
        int status = 429;

        if (e instanceof FlowException) {
            msg = "请求被限流了";
        } else if (e instanceof ParamFlowException) {
            msg = "请求被热点参数限流";
        } else if (e instanceof DegradeException) {
            msg = "请求被降级了";
        } else if (e instanceof AuthorityException) {
            msg = "没有权限访问";
            status = 401;
        }

        response.setContentType("application/json;charset=utf-8");
        response.setStatus(status);
        response.getWriter().println("{\"msg\": " + msg + ", \"status\": " + status + "}");
    }
}
```

重启测试，在不同场景下，会返回不同的异常消息.

限流：

![image-20210716153938887](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-NdzbQI.png)

授权拦截时：

![image-20210716154012736](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-6UgREF.png)

# 5.规则持久化

现在，sentinel 的所有规则都是内存存储，重启后所有规则都会丢失。在生产环境下，我们必须确保这些规则的持久化，避免丢失。

## 5.1.规则管理模式

规则是否能持久化，取决于规则管理模式，sentinel 支持三种规则管理模式：

- 原始模式：Sentinel 的默认模式，将规则保存在内存，重启服务会丢失。
- pull 模式
- push 模式

### 5.1.1.pull 模式

pull 模式：控制台将配置的规则推送到 Sentinel 客户端，而客户端会将配置规则保存在本地文件或数据库中。以后会定时去本地文件或数据库中查询，更新本地规则。

![image-20210716154155238](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-beWnNL.png)

### 5.1.2.push 模式

push 模式：控制台将配置规则推送到远程配置中心，例如 Nacos。Sentinel 客户端监听 Nacos，获取配置变更的推送消息，完成本地配置更新。

![image-20210716154215456](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/06-04-MQj3Bj.png)

## 5.2.实现 push 模式

详细步骤可以参考

[Sentinel 规则持久化](./Sentinel规则持久化.md)

如果不想自己动手，目前已经改造并打包完成了如下：（当然需要企业在自己的业务范围增加修改客制化）

https://zwhid.oss-cn-shenzhen.aliyuncs.com/soft/sentinel-dashboard.jar
