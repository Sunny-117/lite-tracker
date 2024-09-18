# Spring Cache

## 介绍

**Spring Cache**是一个框架，实现了基于注解的缓存功能，只需要简单地加一个注解，就能实现缓存功能，大大简化我们在业务中操作缓存的代码。

Spring Cache 只是提供了一层抽象，底层可以切换不同的 cache 实现。具体就是通过**CacheManager**接口来统一不同的缓存技术。CacheManager 是 Spring 提供的各种缓存技术抽象接口。

针对不同的缓存技术需要实现不同的 CacheManager:

| **CacheManager**    | **描述**                               |
| ------------------- | -------------------------------------- |
| EhCacheCacheManager | 使用 EhCache 作为缓存技术              |
| GuavaCacheManager   | 使用 Google 的 GuavaCache 作为缓存技术 |
| RedisCacheManager   | 使用 Redis 作为缓存技术                |

> 如果不指定，默认使用 hashMap 为基础的 ConcurrentMapCacheManager 技术

## 注解方法

在 SpringCache 中提供了很多缓存操作的注解，常见的是以下的几个：

| **注解**       | **说明**                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| @EnableCaching | 打在启动类上，开启缓存注解功能                                                                                           |
| @Cacheable     | 在方法执行前 spring 先查看缓存中是否有数据，如果有数据，则直接返回缓存数据；若没有数据，调用方法并将方法返回值放到缓存中 |
| @CachePut      | 将方法的返回值放到缓存中                                                                                                 |
| @CacheEvict    | 将一条或多条数据从缓存中删除                                                                                             |

在 spring boot 项目中，使用缓存技术只需在项目中导入相关缓存技术的依赖包，并在启动类上使用@EnableCaching 开启缓存支持即可。

例如，使用 Redis 作为缓存技术，只需要导入 Spring data Redis 的 maven 坐标即可。

## 注解参数

- cacheNames：缓存分类名，通常为模块名
- key : 缓存数据对应的唯一标识， 这个标识需要一个 spring el 表达式
  - 参数名：#argumentName
  - 使用方法的结果 ： #result
  - 可以使用方法的引用，调用方法的对象， 缓存对象 : #root.method | #root.target | #root.caches
  - 可以使用方法名字，当前类的名字: #root.methodName | #root.targetClass
  - 方法的参数 :

    - #root.args[0] 得到第 1 个参数 , #root.args[1] 得到第 2 个参数
    - #p0 得到第 1 个参数 , #p1 得到第 2 个参数
    - #a0 得到第 1 个参数 , #a1 得到第 2 个参数
- condition : 表示满足什么条件, 再进行缓存。注意: **condition 中，是无法获取到结果 #result 的**
- unless : 表示满足条件则不缓存 ; 与上述的 condition 是反向的 ;
- 其他参数：

![image-20220511181606661](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-11-8xTrSl.png)

> 不管是得到返回值 #result 还是得到方法的参数#p0|#a0, 如果得到的是一个对象想要获取对象里面的某个属性，可以继续使用 .属性名的方式来获取这个属性的值充当 key

## 示例代码

#### @CachePut

```java
//添加用户完成，添加缓冲：zwh={username: "zwh", password="123"}
//@CachePut(key = "#id", cacheNames = "user") //#id 代表变量名为id的参数
@CachePut(key = "#root.args[0].username", cacheNames = "user")
@RequestMapping("/user/add")
public User add(User user) {		// /user/add?username=zwh&password=123
    System.out.println("添加用户：" + user);
    return user;
}
```

#### @Cacheable

```java
//查询用户：返回{username: "zwh", password="123"}，如果没有key为zwh的缓存，查询数据库，并将返回值u放到缓存
@Cacheable(key="#p0" ,cacheNames="user")
@RequestMapping("/user/findByUsername")
public User findByUsername(String username){// /user/findByUsername?username=zwh
    //去查询数据库得到一个用户：
    User u = new User("zwh" , "123");
    return u;
}


//有unless参数，数据库返回空不会加入缓存中
@Cacheable(key="#p0" ,cacheNames="user", unless="#result == null")
@RequestMapping("/user02/findByUsername")
public User findByUsername(String username){
    //假设传递过来的用户名，去查数据库，里面没有数据，得到的是 null
    User u = null;
    return u;
}
```

#### @CacheEvict

```java
//删除 key 为 zwh 的缓存
@CacheEvict(key = "#a0" , cacheNames = "user")
@RequestMapping("/user/delete")
public String deleteByUsername(String username){		// /user/delete?username=zwh
    System.out.println("要去删除数据库的数据了：" + username);
    return "删除数据库成功：" +username;
}

//删除 user 的全部缓存
@CacheEvict(allEntries = true, cacheNames = "user")
@RequestMapping("/user/delete02")
public String deleteByUsername02(String username){		// /user/delete?username=zwh
    // delete * from t_user where username = 'admin'
    System.out.println("要去删除数据库的数据了：" + username);
    return "删除数据库成功：" +username;
}
```

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
