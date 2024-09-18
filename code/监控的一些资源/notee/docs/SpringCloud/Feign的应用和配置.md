# Feign 的应用和配置

Feign 是一个**声明式**的 http 客户端，官方地址：https://github.com/OpenFeign/feign

## Feign 客户端入门

#### 1.在服务消费者 pom 文件引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

#### 2.在服务消费者的启动类添加注解开启 Feign 的功能

```java
@MapperScan("com.zwh.order.mapper")
@SpringBootApplication
@EnableFeignClients
public class OrderApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }
}
```

#### 3.编写 Feign 客户端(接口)

```java
package com.zwh.order.client;

@FeignClient("userservice")
public interface UserClient {
    @GetMapping("/user/{id}")
    User findById(@PathVariable("id") Long id);
}
```

- 服务名称：userservice
- 请求方式：GET
- 请求路径：/user/{id}
- 请求参数：Long id
- 返回值类型：User

> 可以直接复制被调用的 controller，但需注意:
>
> 即使请求参数和 controller 参数一致，@PathVariable 和@RequestParam 注解都需要写上 name(单个参数时可不写)

#### 4.在服务消费者 service 层注入 Feign 客户端，并调用

```java
@Service
public class OrderService {

    @Autowired
    private UserClient userClient;

    public Order queryOrderById(Long orderId) {
        Order order = orderMapper.findById(orderId);

      	// 根据 orderId 查询用户信息
        User user = userClient.findById(order.getUserId());

        order.setUser(user);

        return order;
    }
}
```

## 自定义 Feign 的配置

Feign 可以自定义配置来覆盖默认配置，可以修改的配置如下：

| 类型                | 作用             | 说明                                                        |
| ------------------- | ---------------- | ----------------------------------------------------------- |
| feign.Logger.Level  | 修改日志级别     | 包含四种不同的级别：NONE、BASIC、HEADERS、FULL。默认为 NONE |
| feign.codec.Decoder | 响应结果的解析器 | http 远程调用的结果做解析，例如解析 json 字符串为 java 对象 |
| feign.codec.Encoder | 请求参数编码     | 将请求参数编码，便于通过 http 请求发送                      |
| feign. Contract     | 支持的注解格式   | 默认是 SpringMVC 的注解                                     |
| feign. Retryer      | 失败重试机制     | 请求失败的重试机制，默认是没有，不过会使用 Ribbon 的重试    |

#### 自定义配置的方式

下面以日志为例来演示如何自定义配置，其他也是类似。

##### 方式一: 修改 application 配置文件的方式

```yaml
feign:
  client:
    config:
      userservice: # 针对某个微服务的配置
        loggerLevel: FULL
```

```yaml
feign:
  client:
    config:
      default: # 这里用default就是全局配置，如果是写服务名称，则是针对某个微服务的配置
        loggerLevel: FULL # 日志级别
```

##### 方式二: 创建 Logger.Level 的 Bean

创建`config`包下的`DefaultFeignConfiguration`类

```java
package com.zwh.order.config;

public class DefaultFeignConfiguration {

    @Bean
    public Logger.Level feignLogLevel() {
        return Logger.Level.FULL; // 日志级别
    }
}
```

##### 1)如果在启动类上加@EnableFeignClients 注解则代表全局配置

```java
@MapperScan("com.zwh.order.mapper")
@SpringBootApplication
@EnableFeignClients(defaultConfiguration = DefaultFeignConfiguration.class)
public class OrderApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }
}
```

##### 如果在@FeignClient 注解中声明则代表某服务

```java
// client/UserClient
package com.zwh.order.client;

@FeignClient(value = "userservice", configuration = DefaultFeignConfiguration.class)
public interface UserClient {

    @GetMapping("/user/{id}")
    public User findById(@PathVariable(name = "id") Long id);
}
```

> feign 的日志级别
>
> - NONE (默认)：不记录任何日志，性能最佳，适用于生产环境；
> - BASIC (生产推荐)：仅记录请求方法、URL、响应状态代码以及执行时间，适用于生产环境追踪问题；
> - HEADERS：在 BASIC 级别的基础上，记录请求和响应的 header；
> - FULL (debug 推荐)：记录请求和响应的 header、body 和元数据，适用于开发测试定位问题。

## Feign 性能优化

#### 连接池配置

Feign 底层的客户端实现：

- URLConnection：默认实现，不支持连接池
- Apache HttpClient ：支持连接池
- OKHttp：支持连接池

##### Feign 添加 HttpClient 的支持

服务消费者 pom 文件中引入 Apache 的 HttpClient 依赖

```xml
<!--httpClient的依赖 -->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
</dependency>
```

服务消费者的 application.yml 中添加配置

```yaml
feign:
  client:
    config:
      default: # default全局的配置
        loggerLevel: BASIC # 日志级别，BASIC就是基本的请求和响应信息
  httpclient:
    enabled: true # 开启feign对HttpClient的支持
    max-connections: 200 # 最大的连接数
    max-connections-per-route: 50 # 每个路径的最大连接数
```

#### 请求和响应压缩

SpringCloud Feign 支持对请求和响应进行 GZIP 压缩

```yaml
feign:
  compression: #feign压缩配置
    request:
      enabled: true # 配置请求GZIP压缩
      mime-types: text/xml,application/xml,application/json # 设置压缩的请求数据类型(可选)
      min-request-size: 200 # 设置触发压缩的大小下限(可选)
    response:
      enabled: true # 配置响应GZIP压缩
```

## 最佳实践

### 方式一: 继承

一样的代码可以通过继承来共享：

1）定义一个 API 接口，利用定义方法，并基于 SpringMVC 注解做声明。

2）Feign 客户端和 Controller 都集成改接口

![](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-29-dXpNFp.png)

优点：

- 简单
- 实现了代码共享

缺点：

- 服务提供方、服务消费方紧耦合

- 参数列表中的注解映射并不会继承，因此 Controller 中必须再次声明方法、参数列表、注解

### 方式二: 抽取

1.将`FeignClient`抽取为独立模块`feign-api`，并且把接口有关的 POJO、默认的 Feign 配置都放到这个模块中

2.在服务消费者中引入模块`feign-api`作为依赖

```xml
<dependency>
  <groupId>com.zwh.demo</groupId>
  <artifactId>feign-api</artifactId>
  <version>1.0</version>
</dependency>
```

##### 结构图:

```bash
feign-api
└── com
    └── zwh
        └── feign
            ├── client
            │   └── UserClient.java
            ├── config
            │   └── DefaultFeignConfiguration.java
            └── pojo
                └── User.java
```

```bash
order-service
└── com
    └── zwh
        └── order
            ├── OrderApplication.java
            ├── mapper
            │   └── OrderMapper.java
            ├── pojo
            │   └── Order.java
            ├── service
            │   └── OrderService.java
            └── web
                └── OrderController.java
```

![](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-29-Cy5WTP.png)

这时候代码会报错，因为`UserClient`现在在`com.zwh.feign.clients`包下，而`order-service`的`@EnableFeignClients`注解是在`com.zwh.order`包下，不在同一个包，无法扫描到 UserClient。

解决方式有两种，都是需要到`order-service`启动类指定`UserClient`的路径

1. 指定 Feign 应该扫描的包 (推荐)：

   ```java
   @EnableFeignClients(basePackages = "cn.itcast.feign.clients")
   ```

2) 指定需要加载的 Client 接口：

   ```java
   @EnableFeignClients(clients = {UserClient.class})
   ```
