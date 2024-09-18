# Spring 之 RestTemplate

`RestTemplate`是一个执行`HTTP`请求的同步阻塞式工具类，它仅仅只是在 `HTTP` 客户端库（例如 `JDK HttpURLConnection`，`Apache HttpComponents`，`okHttp` 等）基础上，封装了更加简单易用的模板方法 API，利用已提供的模板方法发起网络请求和处理，能很大程度上提升开发效率

## 非 Spring 环境下使用 RestTemplate

如果当前项目不是`Spring`项目，加入`spring-web`包，即可引入`RestTemplate`类

```xml
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-web</artifactId>
  <version>5.2.6.RELEASE</version>
</dependency>
```

编写一个单元测试类，使用`RestTemplate`发送一个`GET`请求，看看程序运行是否正常

```java
@Test
public void simpleTest() {
    RestTemplate restTemplate = new RestTemplate();
    String url = "http://jsonplaceholder.typicode.com/posts/1";
    String str = restTemplate.getForObject(url, String.class);
    System.out.println(str);
}
```

###

## Spring 环境下使用 RestTemplate

如果当前项目是`SpringBoot`，添加如下依赖接口！

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

同时，将`RestTemplate`配置初始化为一个`Bean`

```java
@Configuration
public class RestTemplateConfig {
    @Bean
    public RestTemplate restTemplate(){
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate;
    }
}
```

> 注意，这种初始化方法，是使用了`JDK`自带的`HttpURLConnection`作为底层`HTTP`客户端实现

在需要调用的 service 层注入`restTemplate`对象，然后调用即可

```java
@Service
public class OrderService {

    @Autowired
    private RestTemplate restTemplate;

    public Order queryOrderById(Long orderId) {

        String url = "http://localhost:8081/user/1";

        //参数1 要发送的地址
        //参数2 指定响应数据JSON对应的POJO类型 （内部会自动进行转换）
        User user = restTemplate.getForObject(url, User.class);

      	System.out.println("user = " + user);
    }
}
```

## RestTemplate 支持 get 请求和 post 请求

### get 请求

```java
public <T> T getForObject(String url, Class<T> responseType, Object... uriVariables){}
public <T> T getForObject(String url, Class<T> responseType, Map<String, ?> uriVariables)
public <T> T getForObject(URI url, Class<T> responseType)
```

### post 请求

```java
public <T> postForObject(String url, @Nullable Object request, Class<T> responseType, Object... uriVariables)
throws RestClientException {}

public <T> postForObject(String url, @Nullable Object request, Class<T> responseType, Map<String, ?> uriVariables)
throws RestClientException {}

public <T> postForObject(URI url, @Nullable Object request, Class<T> responseType,  responseType) throws RestClientException {}
```
