## 初识 MQ

#### 同步通讯

同步调用的优点：

- 时效性较强，可以立即得到结果

同步调用的问题：

- 耦合度高
- 性能和吞吐能力下降
- 有额外的资源消耗
- 有级联失败问题

#### 异步通讯

异步调用常见实现就是事件驱动模式
事件是指系统硬件或软件的状态出现任何重大改变

异步通信的优点：

- 耦合度低
- 吞吐量提升
- 故障隔离
- 流量削峰

异步通信的缺点：

- 依赖于 Broker 的可靠性、安全性、吞吐能力
- 架构复杂了，业务没有明显的流程线，不好追踪管理

## RabbitMQ 快速入门

##### RabbitMQ 中的几个概念：

exchange：路由（转发）消息到队列中
queue：缓存消息
virtual host：虚拟主机，是对 queue、exchange 等资源的逻辑分组
publisher：生产者
consumer：消费者

##### hello world 案例

## SpringAMQP

### Basic Queue 简单队列模型

SpringAMQP HelloWorld 基础消息队列

### Work Queue 工作队列模型

- 在 publisher 服务中定义测试方法，每秒产生 50 条消息，发送到 simple.queue
- 在 consumer 服务中定义两个消息监听者，都监听 simple.queue 队列
- 消费者 1 每秒处理 50 条消息，消费者 2 每秒处理 10 条消息

消费预取限

### 发布、订阅模型

发布订阅模式与之前案例的区别就是允许将同一消息发送给多个消费者。实现方式是加入了 exchange（交换机）。
常见 exchange 类型包括：
Fanout：广播
Direct：路由
Topic：话题

### 发布、订阅模型-Fanout

Fanout Exchange 会将接收到的消息广播到每一个跟其绑定的 queue

### 发布、订阅模型-Direct

Direct Exchange 会将接收到的消息根据规则路由到指定的 Queue，因此称为路由模式（routes）。

### 发布、订阅模型-Topic

### 消息转换器
