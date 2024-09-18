# kafka 的使用和配置

## 1.kafka 整合 springboot 入门案例

#### 1. 创建工程 kafka-demo

结构如图:

![image-20220618213331468](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/mfPyPV-mfPyPV.png)

(1)创建 kafka-demo 工程，引入依赖信息

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.zwh</groupId>
    <artifactId>kafka-demo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.8.RELEASE</version>
    </parent>

    <dependencies>
        <!-- kafka依赖 begin -->
        <dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.58</version>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.22</version>
        </dependency>
    </dependencies>
</project>
```

(2)配置 application.yml

```yaml
server:
  port: 8081
spring:
  kafka:
    # 配置连接到服务端集群的配置项 ip:port,ip:port
    bootstrap-servers: 192.168.211.128:9092
    consumer:
      # enable-auto-commit: false # 是否自动提交偏移量，默认是true
      # auto-commit-interval: 100 # 自动提交间隔
      auto-offset-reset: latest
      group-id: test-consumer-group
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer #value 序列化为字符串
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer #key 序列化为字符串
    producer:
      batch-size: 16384 #批次大小上限
      buffer-memory: 33554432 #内存缓冲空间
      key-serializer: org.apache.kafka.common.serialization.StringSerializer #key 序列化为字符串
      value-serializer: org.apache.kafka.common.serialization.StringSerializer #value 序列化为字符串
      retries: 0 # 重试次数
      # acks: 1
```

官方的配置解释如下：

```
https://kafka.apachecn.org/documentation.html#configuration
```

#### 2. 消息生产者

创建类：com.zwh.producer.Producer

```java
package com.zwh.producer;

import com.alibaba.fastjson.JSON;
import com.zwh.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;


@Component
public class Producer {

    @Autowired
    private KafkaTemplate kafkaTemplate;

    public void send() throws Exception {
        User user1 = new User("zwh", "18");
        kafkaTemplate.send("test", JSON.toJSONString(user1));
    }
}
```

#### 3. 消息消费者

创建消费者类：com.zwh.consumer.KafkaConsumer

```java
package com.zwh.consumer;

import com.alibaba.fastjson.JSON;
import com.zwh.pojo.User;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class KafkaConsumer {

    @KafkaListener(topics = {"test"})
    public void listen(ConsumerRecord<String, String> record) throws IOException {

        String value = record.value();

        User user = JSON.parseObject(value, User.class);

        System.out.println("接收到的消息1：" + user + "==" + record.offset());

    }
}
```

启动类：

```java
package com.zwh;

import com.zwh.producer.Producer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class KafkaClientApplicaton {

    public static void main(String[] args) {
        SpringApplication.run(KafkaClientApplicaton.class, args);
    }


    @RestController
    class TestController {
        @Autowired
        private Producer producer;


        @GetMapping("/send")
        public String sendM1() throws Exception {
            producer.send();
            return "ok";
        }
    }
}
```

#### 4. 测试及结论

运行服务，访问 http://localhost:8081/send 进行测试

- 生产者发送消息，同一个组中的多个消费者只能有一个消费者接收消息
- 生产者发送消息，如果有多个组，每个组中只能有一个消费者接收消息,如果想要实现广播的效果，可以让每个消费者单独有一个组即可，这样每个消费者都可以接收到消息

> consumer:
> group-id: test2-consumer-group

### 1.概念详解

![1598766498854](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/sFDzGz-sFDzGz.png)

在 kafka 概述里介绍了概念包括：topic、producer、consumer、broker，这些是最基本的一些概念，想要更深入理解 kafka 还要知道它的一些其他概念定义：

- 消息 Message

  Kafka 中的数据单元被称为消息 message，也被称为记录，可以把它看作数据库表中某一行的记录。

- topic

  Kafka 将消息分门别类，每一类的消息称之为一个主题（Topic）

- 批次

  为了提高效率， 消息会分批次写入 Kafka，批次就代指的是一组消息。

- 分区 Partition

  主题可以被分为若干个分区（partition），同一个主题中的分区可以不在一个机器上，有可能会部署在多个机器上，由此来实现 kafka 的伸缩性。topic 中的数据分割为一个或多个 partition。每个 topic 至少有一个 partition。每个 partition 中的数据使用多个文件进行存储。partition 中的数据是有序的，partition 之间的数据是没有顺序的。如果 topic 有多个 partition，消费数据时就不能保证数据的顺序。在需要严格保证消息的消费顺序的场景下，需要将 partition 数目设为 1。

- broker

  一个独立的 Kafka 服务器就被称为 broker，broker 接收来自生产者的消息，为消息设置偏移量，并提交消息到磁盘保存。

- Broker 集群

  broker 是集群 的组成部分，broker 集群由一个或多个 broker 组成，每个集群都有一个 broker 同时充当了集群控制器的角色（自动从集群的活跃成员中选举出来）。

- 副本 Replica

  Kafka 中消息的备份又叫做 副本（Replica），副本的数量是可以配置的，Kafka 定义了两类副本：领导者副本（Leader Replica） 和 追随者副本（Follower Replica）；所有写请求都通过 Leader 路由，数据变更会广播给所有 Follower，Follower 与 Leader 保持数据同步。如果 Leader 失效，则从 Follower 中选举出一个新的 Leader。当 Follower 与 Leader 挂掉、卡住或者同步太慢，leader 会把这个 follower 从 ISR 列表（保持同步的副本列表）中删除，重新创建一个 Follower。

- Zookeeper

  kafka 对与 zookeeper 是强依赖的，是以 zookeeper 作为基础的，即使不做集群，也需要 zk 的支持。Kafka 通过 Zookeeper 管理集群配置，选举 leader，以及在 Consumer Group 发生变化时进行重平衡。

- 消费者群组 Consumer Group

  生产者与消费者的关系就如同餐厅中的厨师和顾客之间的关系一样，一个厨师对应多个顾客，也就是一个生产者对应多个消费者，消费者群组（Consumer Group）指的就是由一个或多个消费者组成的群体。

- 偏移量 Consumer Offset

  偏移量（Consumer Offset）是一种元数据，它是一个不断递增的整数值，用来记录消费者发生重平衡时的位置，以便用来恢复数据。

- 重平衡 Rebalance

  消费者组内某个消费者实例挂掉后，其他消费者实例自动重新分配订阅主题分区的过程。Rebalance 是 Kafka 消费者端实现高可用的重要手段。

> `System.out.println("偏移量："+record.offset())`

### 2. 生产者详解

（1）发送消息的工作原理

![1598766028671](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/BQabSt-BQabSt.png)

（2）发送类型

- 发送并忘记（fire-and-forget）

  把消息发送给服务器，并不关心它是否正常到达，大多数情况下，消息会正常到达，因为 kafka 是高可用的，而且生产者会自动尝试重发，使用这种方式有时候会丢失一些信息

- 同步发送

  使用 send()方法发送，它会返回一个 Future 对象，调用 get()方法进行等待，就可以知道消息是否发送成功

  ```java
  //发送消息
  try {
      RecordMetadata recordMetadata = producer.send(record).get();
      System.out.println(recordMetadata.offset());//获取偏移量
  }catch (Exception e){
      e.printStackTrace();
  }
  ```

  如果服务器返回错误，get()方法会抛出异常，如果没有发生错误，我们就会得到一个 RecordMetadata 对象，可以用它来获取消息的偏移量

- 异步发送

  调用 send()方法，并指定一个回调函数，服务器在返回响应时调用函数。如下代码

  如果错误则在 OnError 中执行，如果成功 则在 onSuccess 中执行。

代码如下：

```java
@Component
public class Producer {

    @Autowired
    private KafkaTemplate kafkaTemplate;

    public void send() throws Exception {

        kafkaTemplate.setProducerListener(new ProducerListener() {
            @Override
            public void onSuccess(ProducerRecord producerRecord, RecordMetadata recordMetadata) {
                System.out.println("成功了:" + recordMetadata.offset());
            }

            @Override
            public void onError(ProducerRecord producerRecord, Exception exception) {
                System.out.println("失败了:");
            }
        });

        User user1 = new User("zwh", "18");
        kafkaTemplate.send("test", JSON.toJSONString(user1));

    }
}
```

（3）参数详解

生产者还有很多可配置的参数，在 kafka 官方文档中都有说明，大部分都有合理的默认值，所以没有必要去修改它们，不过有几个参数在内存使用，性能和可靠性方法对生产者有影响

- acks

  指的是 producer 的消息发送确认机制

  - acks=0

    生产者在成功写入消息之前不会等待任何来自服务器的响应，也就是说，如果当中出现了问题，导致服务器没有收到消息，那么生产者就无从得知，消息也就丢失了。不过，因为生产者不需要等待服务器的响应，所以它可以以网络能够支持的最大速度发送消息，从而达到很高的吞吐量。

  - acks=1

    只要集群首领节点收到消息，生产者就会收到一个来自服务器的成功响应，如果消息无法到达首领节点，生产者会收到一个错误响应，为了避免数据丢失，生产者会重发消息。

  - acks=all

    只有当所有参与赋值的节点全部收到消息时，生产者才会收到一个来自服务器的成功响应，这种模式是最安全的，它可以保证不止一个服务器收到消息，就算有服务器发生崩溃，整个集群仍然可以运行。不过他的延迟比 acks=1 时更高。

- retries

  生产者从服务器收到的错误有可能是临时性错误，在这种情况下，retries 参数的值决定了生产者可以重发消息的次数，如果达到这个次数，生产者会放弃重试返回错误，默认情况下，生产者会在每次重试之间等待 100ms

### 3. 消费者详解

（1）消费者工作原理

![1598766082318](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/kwTDif-kwTDif.png)

（2）其他参数详解

- enable.auto.commit

  该属性指定了消费者是否自动提交偏移量，默认值是 true。为了尽量避免出现重复数据和数据丢失，可以把它设置为 false，由自己控制何时提交偏移量。如果把它设置为 true,还可以通过配置`auto.commit.interval.ms`属性来控制提交的频率。

- auto.offset.reset

  - earliest

    当各分区下有已提交的 offset 时，从提交的 offset 开始消费；无提交的 offset 时，从头开始消费

  - latest

    当各分区下有已提交的 offset 时，从提交的 offset 开始消费；无提交的 offset 时，消费新产生的该分区下的数据

  - none

    topic 各分区都存在已提交的 offset 时，从 offset 后开始消费；只要有一个分区不存在已提交的 offset，则抛出异常

  - anything else

    向 consumer 抛出异常

（3）提交和偏移量

每次调用 poll()方法，它会返回由生产者写入 kafka 但还没有被消费者读取过来的记录，我们由此可以追踪到哪些记录是被群组里的哪个消费者读取的，kafka 不会像其他 JMS 队列那样需要得到消费者的确认，这是 kafka 的一个独特之处，相反，消费者可以使用 kafka 来追踪消息在分区的位置（偏移量）

消费者会往一个叫做`_consumer_offset`的特殊主题发送消息，消息里包含了每个分区的偏移量。如果消费者一直处于运行状态，那么偏移量就没有什么用处。不过，如果消费者发生崩溃或有新的消费者加入群组，就会触发再均衡，完成再均衡之后，每个消费者可能分配到新的分区，消费者需要读取每个分区最后一次提交的偏移量，然后从偏移量指定的地方继续处理。

如果提交偏移量小于客户端处理的最后一个消息的偏移量，那么处于两个偏移量之间的消息就会被重复处理。

如下图：

![1598759741247](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/IONjg9-IONjg9.png)

如果提交的偏移量大于客户端的最后一个消息的偏移量，那么处于两个偏移量之间的消息将会丢失。

如下图：

![1598759943436](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/bOSRR0-bOSRR0.png)

（4）自动提交偏移量

当`enable.auto.commit`被设置为 true，提交方式就是让消费者自动提交偏移量，每隔 5 秒消费者会自动把从 poll()方法接收的最大偏移量提交上去。提交时间间隔有`auto.commot.interval.ms`控制，默认值是 5 秒。

需要注意到，这种方式可能会导致消息重复消费。假如，某个消费者 poll 消息后，应用正在处理消息，在 3 秒后 Kafka 进行了重平衡，那么由于没有更新位移导致重平衡后这部分消息重复消费。

（5）手动提交当前偏移量

把`enable.auto.commit`设置为 false,让应用程序决定何时提交偏移量。使用 commitSync()提交偏移量，commitSync()将会提交 poll 返回的最新的偏移量，所以在处理完所有记录后要确保调用了 commitSync()方法。否则还是会有消息丢失的风险。

只要没有发生不可恢复的错误，commitSync()方法会一直尝试直至提交成功，如果提交失败也可以记录到错误日志里。

以上为原生的 API 的调用，如果使用 springboot 则如下演示：

步骤：

1. application.yml 关闭自动提交

   ```yaml
   consumer:
     enable-auto-commit: false # 是否自动提交偏移量，默认是true
   ```

2. 设置手动提交模式

   ```java
   package com.zwh;
   @SpringBootApplication
   public class KafkaClientApplicaton {

       public static void main(String[] args) {
           SpringApplication.run(KafkaClientApplicaton.class, args);
       }

       @Bean
       public KafkaListenerContainerFactory<ConcurrentMessageListenerContainer<String, String>> kafkaListenerContainerFactory(ConsumerFactory<String, String> consumerFactory) {
           ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
           factory.setConsumerFactory(consumerFactory);
           //配置手动提交offset
           factory.getContainerProperties().setAckMode((ContainerProperties.AckMode.MANUAL));
           return factory;
       }

       @RestController
       class TestController {
           @Autowired
           private Producer producer;

           @GetMapping("/send")
           public String sendM1() throws Exception {
               producer.send();
               return "ok";
           }
       }
   }
   ```

3) 消费者端 进行 确认

```java
package com.zwh.consumer;

@Component
public class KafkaConsumer {

    @KafkaListener(topics = {"test"})
    public void listen(ConsumerRecord<String, String> record, Acknowledgment acknowledgment) throws IOException {

        String value = record.value();

        User user = JSON.parseObject(value, User.class);

        System.out.println("接收到的消息1：" + user + "==" + record.offset());

        acknowledgment.acknowledge(); //手动提交
    }
}
```
