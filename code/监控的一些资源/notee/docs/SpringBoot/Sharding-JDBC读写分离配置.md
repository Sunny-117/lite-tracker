# Sharding-JDBC 读写分离配置

## 介绍

Sharding-JDBC 定位为轻量级 Java 框架，在 Java 的 JDBC 层提供的额外服务。 它使用客户端直连数据库，以 jar 包形式提供服务，无需额外部署和依赖，可理解为增强版的 JDBC 驱动，完全兼容 JDBC 和各种 ORM 框架。

使用 Sharding-JDBC 可以在程序中轻松的实现数据库读写分离。

Sharding-JDBC 具有以下几个特点：

1). 适用于任何基于 JDBC 的 ORM 框架，如：JPA, Hibernate, Mybatis, Spring JDBC Template 或直接使用 JDBC。

2). 支持任何第三方的数据库连接池，如：DBCP, C3P0, BoneCP, Druid, HikariCP 等。

3). 支持任意实现 JDBC 规范的数据库。目前支持 MySQL，Oracle，SQLServer，PostgreSQL 以及任何遵循 SQL92 标准的数据库。

## 导入依赖

在 pom.xml 中增加 shardingJdbc 的 maven 坐标

```xml
<dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>sharding-jdbc-spring-boot-starter</artifactId>
    <version>4.0.0-RC1</version>
</dependency>
```

## 配置数据源

在项目的 application.yml 中配置数据源相关信息

```yml
---
# sharing-jdbc配置
spring:
  shardingsphere:
    datasource:
      names: master,slave # 数据源的名称，可以自定义
      # 主数据源
      master:
        type: com.alibaba.druid.pool.DruidDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        #characterEncoding=uft-8: 不加此配置,中文会乱码
        url: jdbc:mysql://172.16.137.201:3306/sms?useSSL=false&characterEncoding=utf-8
        username: root
        password: root
      # 从数据源
      slave:
        type: com.alibaba.druid.pool.DruidDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        url: jdbc:mysql://172.16.137.202:3306/sms?useSSL=false&characterEncoding=utf-8
        username: root
        password: root
    # 读写分离配置
    masterslave:
      load-balance-algorithm-type: round_robin #负载均衡配置: 轮询
      name: dataSource # 数据源名称
      master-data-source-name: master # 主库数据源名称，对应上面自定义的数据源名称
      slave-data-source-names: slave # 从库数据源名称列表，多个逗号分隔
    props:
      sql:
        show: true # 开启SQL显示，默认false
  main:
    #将sharding-jdbc datasource bean对象覆盖 druid中datasouce bean对象
    allow-bean-definition-overriding: true
```

> 如果报以下错误，是因为 druid 中 datasouce 对象先声明过了，用 sharding-jdbc 的 datasource bean 对象覆盖即可
>
> ```bash
> Description:
>
> The bean 'dataSource', defined in class path resource [org/apache/shardingsphere/shardingjdbc/spring/boot/SpringBootConfiguration.class], could not be registered. A bean with that name has already been defined in class path resource [com/alibaba/druid/spring/boot/autoconfigure/DruidDataSourceAutoConfigure.class] and overriding is disabled.
>
> Action:
>
> Consider renaming one of the beans or enabling overriding by setting spring.main.allow-bean-definition-overriding=true
> ```

## 测试

查看日志

```mysql
# 查询走 ::: DataSources: slave
[INFO] 17:16:39.754 [http-nio-8888-exec-8] ShardingSphere-SQL - SQL: SELECT COUNT(*) FROM employee ::: DataSources: slave

# 新增走 ::: DataSources: master
[INFO] 17:16:39.754 [http-nio-8888-exec-8] ShardingSphere-SQL - SQL: INSERT INTO employee  ( id,
username,
?,
? ) ::: DataSources: master
```
