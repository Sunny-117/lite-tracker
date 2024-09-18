# Gateway 配置

Spring Cloud Gateway 是 基于 Spring 5.0，Spring Boot 2.0 和 Project Reactor 等响应式编程和事件流技术开发的网关，它旨在为微服务架构提供一种简单有效的统一的 API 路由管理方式。

网关的核心功能：

- **权限控制**：网关作为微服务入口，需要校验用户是是否有请求资格，如果没有则进行拦截。
- **路由和负载均衡**：一切请求都必须先经过 gateway，但网关不处理业务，而是根据某种规则，把请求转发到某个微服务。当然路由的目标服务有多个时，还需要做负载均衡。
- **限流**：当请求流量过高时，在网关中按照下流的微服务能够接受的速度来放行请求，避免服务压力过大。

## gateway 快速入门

基本步骤如下：

1. 创建 SpringBoot 工程 gateway，引入 SpringCloudGateway 的依赖和 nacos 的服务发现依赖
2. 编写启动类
3. application 编写路由配置及 nacos 地址

#### 1. 引入依赖：

```xml
<!--网关-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>

<!--nacos服务发现依赖-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

> 注意: spring-cloud-starter-gateway 和 spring-boot-starter-web 有冲突

#### 2. 编写启动类

```java
package com.zwh.gateway;

@SpringBootApplication
public class GatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}
}
```

#### 3. 编写基础配置和路由规则

```yaml
server:
  port: 10010 # 网关端口
spring:
  application:
    name: gateway # 服务名称
  cloud:
    nacos:
      server-addr: localhost:8848 # nacos地址
    gateway:
      routes: # 网关路由配置
        - id: user-service # 路由id，自定义，只要唯一即可
          uri: lb://userservice # 路由的目标地址 lb就是负载均衡，后面跟nacos注册的服务名称
          predicates: # 路由断言，也就是判断请求是否符合路由规则的条件
            - Path=/user/** # 这个是按照路径匹配，只要以/user/开头就符合要求
```

> 将符合`Path` 规则的一切请求，都代理到 `uri`参数指定的地址。
>
> 这里是将 `/user/**`开头的请求，代理到`lb://userservice`，lb 是负载均衡，根据服务名拉取服务列表，实现负载均衡。
>
> 如果是 uri 是 `http://127.0.0.1:8081`，则路由的目标是固定地址

#### 网关路由的流程图

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-29-UT2jBx.png" style="zoom:50%;" />

## 断言工厂

上面的`Path=/user/**`是按照路径匹配，这个规则是由`org.springframework.cloud.gateway.handler.predicate.PathRoutePredicateFactory`类来处理的。

像这样的断言工厂在 SpringCloudGateway 还有十几个，都会将配置文件中写的断言规则，转变为路由判断的条件:

|            | 说明                            | 示例                                                                                                   |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| After      | 是某个时间点后的请求            | - After=2037-01-20T17:42:47.789-07:00[America/Denver]                                                  |
| Before     | 是某个时间点之前的请求          | - Before=2031-04-13T15:14:47.433+08:00[Asia/Shanghai]                                                  |
| Between    | 是某两个时间点之前的请求        | - Between=2037-01-20T17:42:47.789-07:00[America/Denver], 2037-01-21T17:42:47.789-07:00[America/Denver] |
| Cookie     | 请求必须包含某些 cookie         | - Cookie=chocolate, ch.p                                                                               |
| Header     | 请求必须包含某些 header         | - Header=X-Request-Id, \d+                                                                             |
| Host       | 请求必须是访问某个 host（域名） | - Host=.somehost.org,.anotherhost.org                                                                  |
| Method     | 请求方式必须是指定方式          | - Method=GET,POST                                                                                      |
| Path       | 请求路径必须符合指定规则        | - Path=/red/{segment},/blue/\*\*                                                                       |
| Query      | 请求参数必须包含指定参数        | - Query=name, Jack 或者- Query=name                                                                    |
| RemoteAddr | 请求者的 ip 必须是指定范围      | - RemoteAddr=192.168.1.1/24                                                                            |
| Weight     | 权重处理                        |                                                                                                        |

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-29-izujYH.png" style="zoom: 50%;" />

## 过滤器工厂

GatewayFilter 是网关中提供的一种过滤器，可以对**进入网关的**请求和微服务返回的响应做处理。

Spring 提供了 31 种不同的路由过滤器工厂:

| 名称                 | 说明                         |
| -------------------- | ---------------------------- |
| AddRequestHeader     | 给当前请求添加一个请求头     |
| RemoveRequestHeader  | 移除请求中的一个请求头       |
| AddResponseHeader    | 给响应结果中添加一个响应头   |
| RemoveResponseHeader | 从响应结果中移除有一个响应头 |
| RequestRateLimiter   | 限制请求的流量               |
| ...                  |                              |

![image-20220529190031048](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-29-h9sLgU.png)

要添加过滤器，只需要修改 gateway 服务的 application.yml 文件，添加路由过滤即可：

##### 只对特定路由生效

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://userservice
          predicates:
            - Path=/user/**
          filters: # 过滤器
            - AddRequestHeader=name, zwh # 添加请求头
```

##### 对所有的路由都生效

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://userservice
          predicates:
            - Path=/user/**
      default-filters: # 默认过滤项
        - AddRequestHeader=name, zwh # 添加请求头
```

## 全局过滤器 GlobalFilter

全局过滤器的作用也是处理一切进入网关的请求和微服务响应，与 GatewayFilter 的作用一样。区别在于 GatewayFilter 通过配置定义，处理逻辑是固定的。而 GlobalFilter 的逻辑需要自己写代码实现，可以实现下列功能：

- 登录状态判断
- 权限校验
- 请求限流等

实现方式是创建一个类，这个类实现 GlobalFilter 接口，并交给 spring IOC 管理。

```java
public interface GlobalFilter {
    /**
     *  处理当前请求，有必要的话通过{@link GatewayFilterChain}将请求交给下一个过滤器处理
     *
     * @param exchange 请求上下文，里面可以获取Request、Response等信息
     * @param chain 用来把请求委托给下一个过滤器
     * @return {@code Mono<Void>} 返回标示当前过滤器业务结束
     */
    Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain);
}
```

#### 自定义全局过滤器

需求：定义全局过滤器，拦截请求，判断请求的参数是否满足下面条件：

- 参数中是否有 authorization，

- authorization 参数值是否为 admin

如果同时满足则放行，否则拦截

```java
package com.zwh.gateway.filters;

@Component //交给 IOC 管理
//@Order(1)
public class AuthorizeFilter implements GlobalFilter, Ordered {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        //1. 获取请求对象 和 响应对象
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();

        //2. 获取请求参数
        String authorization = request.getQueryParams().getFirst("authorization");

        //3. 判断是否有 authorization 参数和值是否为空，如果没有或为空，报错返回
        if (StringUtils.isEmpty(authorization)) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED); // 401
            return response.setComplete(); //响应完成，结束方法
        }

        //4.走到这里就是有 authorization 参数的值，判断参数的值是否等于 admin，如果不是，报错返回
        if (!"admin".equals(authorization)) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);//401
            return response.setComplete();//响应完成，结束方法
        }

        //5.放行，交给下一个过滤器去执行
        return chain.filter(exchange);
    }

    //过滤器执行的优先级，数字越小，优先级越高
    @Override
    public int getOrder() {
        return -1;
    }
}
```

## 过滤器执行顺序

请求进入网关会碰到三类过滤器：当前路由的过滤器、DefaultFilter、GlobalFilter

请求路由后，会将当前路由过滤器和 DefaultFilter、GlobalFilter，合并到一个过滤器链（集合）中，排序后依次执行每个过滤器：

过滤器的排序的规则:

- 每一个过滤器都必须指定一个 int 类型的 order 值，**order 值越小，优先级越高，执行顺序越靠前**。
- GlobalFilter 通过实现 Ordered 接口，或者添加@Order 注解来指定 order 值，由我们自己指定
- 路由过滤器和 defaultFilter 的 order 由 Spring 指定，默认是按照声明顺序从 1 递增。
- 当过滤器的 order 值一样时，会按照 defaultFilter > 路由过滤器 > GlobalFilter 的顺序执行。

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-29-BPXshu.png" style="zoom:50%;" />

参考源码：

`org.springframework.cloud.gateway.route.RouteDefinitionRouteLocator#getFilters()`方法是先加载 defaultFilters，然后再加载某个 route 的 filters，然后合并。

`org.springframework.cloud.gateway.handler.FilteringWebHandler#handle()`方法会加载全局过滤器，与前面的过滤器合并后根据 order 排序，组织过滤器链

## 跨域配置

gateway 的跨域配置同样是 CORS 方案，在 application.yml 文件中添加即可：

```yaml
spring:
  cloud:
    gateway:
      # ...
      globalcors: # 全局的跨域处理
        add-to-simple-url-handler-mapping: true # 解决options请求被拦截问题
        corsConfigurations:
          '[/**]':
            allowedOrigins: # 允许哪些网站的跨域请求
              - 'http://localhost:8090'
            allowedMethods: # 允许的跨域ajax的请求方式
              - 'GET'
              - 'POST'
              - 'DELETE'
              - 'PUT'
              - 'OPTIONS'
            allowedHeaders: '*' # 允许在请求中携带的头信息
            allowCredentials: true # 是否允许携带cookie
            maxAge: 360000 # 这次跨域检测的有效期
```
