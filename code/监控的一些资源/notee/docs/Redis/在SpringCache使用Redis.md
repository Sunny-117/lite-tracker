## 在 Spring cache 使用 redis 缓存

在 Spring Boot 项目中使用 Spring Cache 的操作步骤(使用 redis 缓存技术)：

1. 导入 maven 坐标

   spring-boot-starter-cache、spring-boot-starter-data-redis

   ```xml
    <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-cache</artifactId>
   </dependency>

   <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-data-redis</artifactId>
   </dependency>
   ```

2. 配置 application.yml

   ```yaml
   spring:
     # 缓存有效期，单位是毫秒
     cache:
       redis:
         time-to-live: 1800000
   ```

3. 在启动类上加入@EnableCaching 注解，开启缓存注解功能

4. 在**Controller**或**Service**的方法上加入@Cacheable、@CacheEvict 等注解，进行缓存操作
