# Redis 常用命令

## Redis 数据类型

Redis 存储的是 key-value 结构的数据，其中 key 是字符串类型，value 有 5 种常用的数据类型：

- 字符串 string
- 哈希 hash
- 列表 list
- 集合 set
- 有序集合 sorted set / zset

![image-20210927111819871](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-11-ObGU7l.png)

> 字符串(string)：普通字符串，常用
>
> 哈希(hash)：适合存储对象
>
> 列表(list)：按照插入顺序排序，可以有重复元素
>
> 集合(set)：无序集合，没有重复元素
>
> 有序集合(sorted set / zset)：集合中每个元素关联一个分数（score），根据分数升序排序，没有重复元素

## 通用命令

Redis 中的通用命令，主要是针对 key 进行操作的相关命令：

`keys pattern` 查找所有符合给定模式( pattern)的 key ，常用`keys *`
`exists key` 检查给定 key 是否存在
`type key` 返回 key 所储存的值的类型
`ttl key` 返回给定 key 的剩余生存时间(TTL, time to live)，以秒为单位
`del key` 该命令用于在 key 存在是删除 key
`select index` 选择数据库

## 字符串 string 操作命令

Redis 中字符串类型常用命令：

- **SET** key value 设置指定 key 的值
- **GET** key 获取指定 key 的值
- **SETEX** key seconds value 设置指定 key 的值，并将 key 的过期时间设为 seconds 秒
- **SETNX** key value 只有在 key 不存在时设置 key 的值

更多命令可以参考 Redis 中文网：https://www.redis.net.cn

### 4.2 哈希 hash 操作命令

Redis hash 是一个 string 类型的 field 和 value 的映射表，hash 特别适合用于存储对象，常用命令：

- **HSET** key field value 将哈希表 key 中的字段 field 的值设为 value
- **HGET** key field 获取存储在哈希表中指定字段的值
- **HDEL** key field 删除存储在哈希表中的指定字段
- **HKEYS** key 获取哈希表中所有字段
- **HVALS** key 获取哈希表中所有值
- **HGETALL** key 获取在哈希表中指定 key 的所有字段和值

![image-20210927113014567](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-11-SMY71d.png)

### 4.3 列表 list 操作命令

Redis 列表是简单的字符串列表，按照插入顺序排序，常用命令：

- **LPUSH** key value1 [value2] 将一个或多个值插入到列表头部
- **LRANGE** key start stop 获取列表指定范围内的元素
- **RPOP** key 移除并获取列表最后一个元素
- **LLEN** key 获取列表长度
- **BRPOP** key1 [key2 ] timeout 移出并获取列表的最后一个元素， 如果列表没有元素会阻塞列表直到等待超 时或发现可弹出元素为止

![image-20210927113312384](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-11-8vbKOz.png)

### 4.4 集合 set 操作命令

Redis set 是 string 类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据，常用命令：

- **SADD** key member1 [member2] 向集合添加一个或多个成员
- **SMEMBERS** key 返回集合中的所有成员
- **SCARD** key 获取集合的成员数
- **SINTER** key1 [key2] 返回给定所有集合的交集
- **SUNION** key1 [key2] 返回所有给定集合的并集
- **SDIFF** key1 [key2] 返回给定所有集合的差集
- **SREM** key member1 [member2] 移除集合中一个或多个成员

![image-20210927113632472](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-11-UaFxZL.png)

### 4.5 有序集合 sorted set 操作命令

Redis sorted set 有序集合是 string 类型元素的集合，且不允许重复的成员。每个元素都会关联一个 double 类型的分数(score) 。redis 正是通过分数来为集合中的成员进行从小到大排序。有序集合的成员是唯一的，但分数却可以重复。

常用命令：

- **ZADD** key score1 member1 [score2 member2] 向有序集合添加一个或多个成员，或者更新已存在成员的 分数
- **ZRANGE** key start stop [WITHSCORES] 通过索引区间返回有序集合中指定区间内的成员
- **ZINCRBY** key increment member 有序集合中对指定成员的分数加上增量 increment
- **ZREM** key member [member ...] 移除有序集合中的一个或多个成员

![image-20210927114003383](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-11-wnPJpf.png)

### 字符串 string 操作命令

Redis 中字符串类型常用命令：

- `set key value` 设置指定 key 的值
- `get key` 获取指定 key 的值
- `setex key seconds value` 设置指定 key 的值，并将 key 的过期时间设为 seconds 秒
- `setnx key value` 只有在 key 不存在时设置 key 的值

### 哈希 hash 操作命令

Redis hash 是一个 string 类型的 field 和 value 的映射表，hash 特别适合用于存储对象，常用命令：

- hset key field value 将哈希表 key 中的字段 field 的值设为 value
- hget key field 获取存储在哈希表中指定字段的值
- hdel key field 删除存储在哈希表中的指定字段
- hkeys key 获取哈希表中所有字段
- hvals key 获取哈希表中所有值
- hgetall key 获取在哈希表中指定 key 的所有字段和值

![截屏2022-05-10 上午11.53.46](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-10-lYZWKV.png)

### 列表 list 操作命令

Redis 列表是简单的字符串列表，按照插入顺序排序，常用命令：

- lpush key value1 [value2] 将一个或多个值插入到列表头部

- lrange key start stop 获取列表指定范围内的元素 左边

  ```bash
  lrange 0 -1
  ```

* rpop key 移除并获取列表最后一个元素

  ```bash

  ```

* llen key 获取列表长度

* brpop key1 [key2 ] timeout 移出并获取列表的最后一个元素， 如果列表没有元素会阻塞列表直到等待\
   超时或发现可弹出元素为止

### 集合 set 操作命令

Redis set 是 string 类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据，常用命令：

- sadd key member1 [member2] 向集合添加一个或多个成员
- smembers key 返回集合中的所有成员
- scard key 获取集合的成员数
- sinter key1 [key2] 返回给定所有集合的交集
- sunion key1 [key2] 返回所有给定集合的并集
- sdiff key1 [key2] 返回给定所有集合的差集(key1 有，key2 无的成员)
- srem key member1 [member2] 移除集合中一个或多个成员

### 有序集合 sorted set 操作命令

Redis sorted set 有序集合是 string 类型元素的集合，且不允许重复的成员。每个元素都会关联一个 double 类型的分数(score) 。redis 正是通过分数来为集合中的成员进行从小到大排序。有序集合的成员是唯一的，但分数却可以重复。
常用命令：
zadd key score1 member1 [score2 member2] 向有序集合添加一个或多个成员，或者更新已存在成员的分数
zrange key start stop [WITHSCORES] 通过索引区间返回有序集合中指定区间内的成员(加上 withscores 将返回成员和分数)
zincrby key increment member 有序集合中对指定成员的分数加上增量 increment
zrem key member [member ...] 移除有序集合中的一个或多个成员
