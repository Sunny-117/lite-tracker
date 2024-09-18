# 微服务和 SpringCloud 介绍

## 单体结构和分布式架构的对比

#### 单体架构

将业务的所有功能集中在一个项目中开发，打成一个包部署。

**优点：**

- 架构简单
- 部署成本低

**缺点：**

- 耦合度高（维护困难、升级困难）

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-7D1Nfe.png" alt="image-20210713202807818" style="zoom: 50%;" />

#### 分布式架构

根据业务功能对系统做拆分，每个业务功能模块作为独立项目开发，称为一个服务。

**优点：**

- 降低服务耦合
- 有利于服务升级和拓展

**缺点：**

- 服务调用关系错综复杂

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-26-FSWxDR.png" alt="image-20210713203124797" style="zoom:50%;" />

分布式架构虽然降低了服务耦合，但是服务拆分时也有很多问题需要思考：

- 服务拆分的粒度如何界定？
- 服务之间如何调用？
- 服务的调用关系如何管理？

需要制定一套行之有效的标准来约束分布式架构。

## 微服务

微服务是一种经过良好架构设计的分布式架构方案，微服务架构特征：

- 单一职责：微服务拆分粒度更小，每一个服务都对应唯一的业务能力，做到单一职责，避免重复业务开发
- 面向服务：微服务对外暴露业务接口
- 自治：团队独立、技术独立、数据独立、部署独立
- 隔离性强：服务调用做好隔离、容错、降级，避免出现级联问题

##### 微服务技术对比

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-25-5Mjbxo.png" style="zoom:50%;" />

## SpringCloud

SpringCloud 是目前国内使用最广泛的微服务框架。

SpringCloud 集成了各种微服务功能组件，并基于 SpringBoot 实现了这些组件的自动装配，从而提供了良好的开箱即用体验。

##### SpringCloud 的常见组件

![image-20220525095304585](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-25-vJ2YrN.png)

##### SpringCloud 与 SpringBoot 的版本兼容关系:

![image-20220525094857929](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-25-wxF2na.png)

## 微服务服务拆分原则

- 不同微服务，不要重复开发相同业务
- 微服务数据独立，不要访问其它微服务的数据库
- 微服务可以将自己的业务暴露为接口，供其它微服务调用
