# Nacos 配置中心配置

Nacos 除了可以做 [注册中心](Nacos注册中心配置.md)，同样可以做配置管理来使用。

## 为什么需要配置中心

当微服务部署的实例越来越多时，微服务配置的维护更新将会非常困难，而且很容易出错。我们需要一种统一配置管理方案，可以集中管理所有实例的配置。Nacos 一方面可以将配置集中管理，另一方可以在配置变更时，及时通知微服务，实现配置的热更新。

- 批量更新配置
- 实现配置热更新

![image-20210714164426792](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-28-fbpvu0.png)

### 配置合并规则

微服务要拉取 nacos 中管理的配置，并且与本地的 application.yml 配置合并，才能完成项目启动。

spring 引入了一种新的配置文件：bootstrap.yaml 文件，会在 application.yml 之前被读取。

所以 nacos 配置中心的信息可以写在 bootstrap.yaml 文件，流程如下：

![img](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-28-CZENMz.png)

> 注意：项目的核心配置，需要热更新的配置才放到 nacos 管理。基本不会变更的一些配置还是保存在微服务本地。

## 搭建配置中心

### 1. 新建配置

在 nacos 控制台新建一个配置表单。配置 id 为:

`${spring.application.name}-${spring.profiles.active}.${spring.cloud.nacos.config.file-extension}`

`[服务名]-[环境名].[文件格式后缀]`

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-28-7f9MjN.png" style="zoom: 50%;" />

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-28-HYNWJ9.png" style="zoom:50%;" />

### 2. 引入 nacos-config 依赖

```xml
<!--nacos配置管理依赖-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

### 3. 创建 bootstrap.yaml

服务名称、当前环境、nacos 地址、文件后缀名

```yaml
spring:
  application:
    name: userservice # 服务名称
  profiles:
    active: dev # 开发环境，这里是dev
  cloud:
    nacos:
      server-addr: localhost:8848 # Nacos地址
      config:
        file-extension: yaml # 文件后缀名
```

> 根据`${spring.application.name}-${spring.profiles.active}.${spring.cloud.nacos.config.file-extension}`
>
> 微服务启动后会去 nacos 服务器 `localhost:8848` 读取 `userservice-dev.yaml` 配置

## 配置热更新

要让修改 nacos 配置中心的配置后，微服务中无需重启即可自动拉取 nacos 配置中心的配置进行热更新，方式有两种

### 1.方式一

通过@Value 注入的变量，在所在类上添加注解@RefreshScope

```java
@RefreshScope
@RestController
@RequestMapping("/user")
public class UserController {

    @Value("${pattern.dateformat}") //pattern.dateformat 是nacos配置的key
    private String dateformat;

    @GetMapping("now")
    public String now(){
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(dateformat));
    }
}
```

### 2.方式二

通过 pojo 和 @ConfigurationProperties 注入的变量，能自动实现热更新

```java
@Component
@Data
@ConfigurationProperties(prefix = "pattern")
public class PatternProperties {
    private String dateformat;
}
```

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private PatternProperties patternProperties;

    @GetMapping("now")
    public String now(){
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(patternProperties.getDateformat()));
    }
}
```

## 多环境配置共享

微服务启动时会从 nacos 读取多个配置文件：

- [spring.application.name]-[spring.profiles.active].yaml，例如：userservice-dev.yaml
- [spring.application.name].yaml，例如：userservice.yaml

无论 profile 如何变化，[spring.application.name].yaml 这个文件一定会加载，因此多环境共享的配置可以写入这个文件

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-28-VVxyEg.png" alt="image-20220528215237299" style="zoom: 50%;" />

##### 多种配置同属性的优先级：

[服务名]-[环境].yaml >[服务名].yaml > 本地配置

![](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-28-USeMZB.png)
