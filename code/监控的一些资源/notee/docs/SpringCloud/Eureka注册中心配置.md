# Eureka 注册中心配置

## 1.Eureka 能解决什么问题(作用)

- 消费者该如何获取服务提供者具体信息？
  - 服务提供者启动时向 eureka 注册自己的信息
  - eureka 保存这些信息
  - 消费者根据服务名称向 eureka 拉取提供者信息
- 如果有多个服务提供者，消费者该如何选择？
  - 服务消费者利用负载均衡算法，从服务列表中挑选一个
- 消费者如何感知服务提供者健康状态？
  - 服务提供者会每隔 30 秒向 EurekaServer 发送心跳请求，报告健康状态
  - eureka 会更新记录服务列表信息，心跳不正常会被剔除
  - 消费者就可以拉取到最新的信息

## 2.提供者与消费者

在服务调用关系中，会有两个不同的角色：

**服务提供者**：一次业务中，被其它微服务调用的服务。（提供接口给其它微服务）

**服务消费者**：一次业务中，调用其它微服务的服务。（调用其它微服务提供的接口）

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-gvDQTN.png" alt="image-20210713214404481" style="zoom:33%;" />

但是，服务提供者与服务消费者的角色并不是绝对的，而是相对于业务而言。

如果服务 A 调用了服务 B，而服务 B 又调用了服务 C，服务 B 的角色是什么？

- 对于 A 调用 B 的业务而言：A 是服务消费者，B 是服务提供者
- 对于 B 调用 C 的业务而言：B 是服务消费者，C 是服务提供者

因此，服务 B 既可以是服务提供者，也可以是服务消费者。

## 3.Eureka 架构

在 Eureka 架构中，微服务角色有两类：

- **EurekaServer：服务端**(注册中心)
  - 记录服务信息
  - 心跳监控
- **EurekaClient：客户端**
  - Provider：服务提供者，例如案例中的 user-service
    - 注册自己的信息到 EurekaServer
    - 每隔 30 秒向 EurekaServer 发送心跳
  - consumer：服务消费者，例如案例中的 order-service
    - 根据服务名称从 EurekaServer 拉取服务列表
    - 基于服务列表做负载均衡，选中一个微服务后发起远程调用

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-e6rq5o.png" alt="image-20220525105634519" style="zoom:50%;" />

## 4.搭建 Eureka

#### Eureka 服务端(注册中心)

1.创建 eureka-server 服务模块，并在 pom 中添加 SpringCloud 为 eureka 提供的 starter 依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

2.在启动类添加`@EnableEurekaServer`注解

```java
@EnableEurekaServer //开启 eureka 服务注解
@SpringBootApplication
public class EurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }
}
```

3.创建 application.yml 配置文件

```yaml
server:
  port: 10086
spring:
  application:
    name: eureka-server
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka
```

4.启动服务

启动 eureka-server 服务模块，在浏览器访问：http://127.0.0.1:10086 是否成功

#### Eureka 客户端

服务发现、服务注册统一都封装在 eureka-client 依赖，所有需要在在**服务提供者**和**服务消费者**中分别添加**eureka-client 依赖**

##### 1.**服务提供者**和**服务消费者**pom 中添加依赖 eureka-client 依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

##### 2.服务消费者

- application.yml 配置文件

```yaml
spring:
  application:
    name: orderservice
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka
```

- 给 RestTemplate 添加@LoadBalanced 注解

要去 eureka-server 中拉取 userservice 服务的实例列表，并且实现负载均衡，需要打上`@LoadBalanced`注解

```java
@SpringBootApplication
public class OrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }

    @LoadBalanced
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

- 用服务提供者的服务名称远程调用

```java
@Service
public class OrderService {
    @Autowired
    private RestTemplate restTemplate;

    public Order queryOrderById(Long orderId) {

        //拼接请求 url，这里的 userservice 是服务提供者的application-name
        String url = "http://userservice/user/" + order.getUserId();

        //获取 user对象
        User user = restTemplate.getForObject(url, User.class);

       //打印返回结果
       System.out.println("user = " + user);
    }
}
```

##### 3.服务提供者

- application.yml 配置文件

```yaml
spring:
  application:
    name: userservice
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka
```

> 服务提供者 和 服务消费者 的 启动类中 @EnableEurekaClient 注解可以不加

## 5.Eureka 的负载均衡

Eureka 的依赖集成了**Ribbon 负载均衡**，默认是`ZoneAvoidanceRule`，是一种轮询方案

通过定义 IRule 实现可以修改负载均衡规则，有两种方式

- 1.在服务消费者的启动类中，定义一个新的 IRule。这种负载均衡规则是针对全局的

```java
@SpringBootApplication
public class OrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }

    @LoadBalanced
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public IRule randomRule() {
        return new RandomRule();
    }
}
```

- 2.在服务消费者的 application.yml 文件中，添加新的配置也可以修改规则：

```yaml
userservice: # 给某个微服务配置负载均衡规则，这里是userservice服务
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule # 负载均衡规则
```

## 6.其他

[Ribbon 负载均衡策略](./Ribbon负载均衡)

[Ribbon 负载均衡饥饿模式](./Ribbon负载均衡)

优先选择同集群服务实例列表
本地集群找不到提供者，才去其它集群寻找，并且会在服务消费者端报警告
确定了可用实例列表后，再采用随机负载均衡挑选实例
