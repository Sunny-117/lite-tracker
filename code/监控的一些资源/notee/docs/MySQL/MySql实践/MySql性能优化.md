# MySql 性能优化

# 1.优化介绍

#### 优化的方向

在数据库优化上有两个主要方向：即安全与性能。

- 安全 : 数据安全性
- 性能 : 数据的高性能访问

这里主要是在**性能优化**方向进行介绍

#### 优化的维度

![1567415666402](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/alEESm-alEESm.png)

数据库优化分为四个纬度：硬件，系统配置，数据库表结构，SQL 及索引

**硬件： ** CPU、内存、存储、网络设备等

**系统配置：** 服务器系统、数据库服务参数等

**数据库表结构：** 高可用、分库分表、读写分离、存储引擎、表设计等

**Sql 及索引：** sql 语句、索引使用等

- 从优化成本进行考虑：硬件>系统配置>数据库表结构>SQL 及索引
- 从优化效果进行考虑：硬件<系统配置<数据库表结构<SQL 及索引

#### 优化思路

- **应急调优**

针对突然的业务办理卡顿，无法进行正常的业务处理，需要立马解决的场景。

1.  `show processlist;`（查看连接 session 状态）

2.  `explain [SQL语句];`(分析查询计划)，`show index from [tableName];`（分析索引）

3.  `show status like '%lock%';` 查询锁状态

- **常规调优的思路**

针对业务周期性的卡顿，例如在每天 10-11 点业务特别慢，但是还能够使用，过了这段时间就好了。

1. 开启**慢查询日志**，运行一天
2. 查看 slowlog，分析 slowlog，分析出查询慢的语句。
3. 按照一定优先级，进行一个一个的排查所有慢语句。
4. 分析 top sql，进行 explain 调试，查看语句执行时间。
5. 调整索引或语句本身。

# 2. 优化实践

## 1.慢查询日志开启

默认情况下慢日志查询是禁用的

```sql
# 查看慢查询日志的开启状态
show variables like '%slow_query_log%';
```

- 临时开启慢查询日志，重启 MySQL 后，则会关闭

```sql
set global slow_query_log=1;
```

- 长期开启慢查询日志

配置文件`/etc/my.cnf`的**[mysqld]**下面加入三个配置参数

```bash
# 开启慢查询日志
slow_query_log=ON
# 慢查询日志路径
slow-query-log-file=/var/lib/mysql/slow-query.log
# 执行时间超过1s的sql语句会被记录
long_query_time=2
```

修改完成后，重启 mysql

```bash
service mysqld restart
```

> my.cnf 一般会放在/etc/my.cnf，/etc/mysql/my.cnf。或者 find 命令查找`find /etc -name 'my.cnf'`

## 2.慢查询分析

如果慢查询日志中记录内容很多，可以使用**mysqldumpslow**工具（MySQL 客户端安装自带）来对慢查询日志进行分类汇总。mysqldumpslow 对日志文件进行了分类汇总，显示汇总后摘要结果。

```sql
#进入slow-query.log存放目录
cd /var/lib/mysql

# 分析所有日志记录
mysqldumpslow slow-query.log
```

**mysqldumpslow 的参数**

```sql
# 记录次数最多的10条SQL语句
mysqldumpslow -s c -t 10 slow-query.log

# 返回记录集最多的10个查询
mysqldumpslow -s r -t 10 slow-query.log

# 按照时间排序的前10条里面含有左连接的查询语句
mysqldumpslow -s t -t 10 -g “leftjoin” slow-query.log
```

> - -s, 是表示按照何种方式排序
>
> - c、t、l、r 分别是按照记录次数、时间、查询时间、返回的记录数来排序，ac、at、al、ar，表示相应的倒叙
>
> - -t, 是 top n 的意思，即为返回前面多少条的数据

使用 mysqldumpslow 命令可以非常明确的得到各种我们需要的查询语句，对 MySQL 查询语句的监控、分析、优化是 MySQL 优化非常重要的一步。开启慢查询日志后，由于日志记录操作，在一定程度上会占用 CPU 资源影响 mysql 的性能，但是可以阶段性开启来定位性能瓶颈。

## 3.执行计划 Explain

得到了查询慢的语句后，需要用 explain 对语句进行分析。

explain 关键字可以模拟优化器执行 SQL 查询语句,从而知道 MYSQL 是如何处理 SQL 语句的。我们可以用执行计划来分析查询语句或者表结构的性能瓶颈。

### 环境准备

创建 t1，t2，t1 三张表，各添加一条数据，各创建索引

```sql
CREATE TABLE t1 (id INT PRIMARY KEY,NAME VARCHAR (20),col1 VARCHAR (20),col2 VARCHAR (20),col3 VARCHAR (20)); CREATE TABLE t2 (id INT PRIMARY KEY,NAME VARCHAR (20),col1 VARCHAR (20),col2 VARCHAR (20),col3 VARCHAR (20)); CREATE TABLE t3 (id INT PRIMARY KEY,NAME VARCHAR (20),col1 VARCHAR (20),col2 VARCHAR (20),col3 VARCHAR (20));
INSERT INTO t1 VALUES (1,'zs1','col1','col2','col3');
INSERT INTO t2 VALUES (1,'zs2','col2','col2','col3');
INSERT INTO t3 VALUES (1,'zs3','col3','col2','col3');
CREATE INDEX ind_t1_c1 ON t1 (col1);
CREATE INDEX ind_t2_c1 ON t2 (col1);
CREATE INDEX ind_t3_c1 ON t3 (col1);
CREATE INDEX ind_t1_c12 ON t1 (col1,col2);
CREATE INDEX ind_t2_c12 ON t2 (col1,col2);
CREATE INDEX ind_t3_c12 ON t3 (col1,col2);
```

### Explain 作用

1. 查看表的读取顺序
2. 查看数据库读取操作的操作类型
3. 查看哪些索引有可能被用到
4. 查看哪些索引真正被用到
5. 查看表之间的引用
6. 查看表中有多少行记录被优化器查询

### Explain 语法

`explain [sql语句]`

```sql
# 示例
explain select t2.* from t1, t2, t3 where t1.id = t2.id and t1.id= t3.id and t1.name = 'zs';
```

![](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/uWgrKu-uWgrKu.png)

### 字段详解

- id: 执行优先级

  - id 值相同：执行顺序由上而下
  - id 值不同：id 值越大优先级越高

- select_type: 执行类型

  - SIMPLE : 简单的 select 查询,查询中不包含子查询或者 UNION
  - PRIMARY: 查询中若包含复杂的子查询,最外层的查询则标记为 PRIMARY
  - SUBQUERY : 在 SELECT 或者 WHERE 列表中包含子查询
  - DERIVED : 在 from 列表中包含子查询被标记为 DRIVED 衍生,MYSQL 会递归执行这些子查询,把结果放到临时表中
  - UNION: 若第二个 SELECT 出现在 union 之后,则被标记为 UNION, 若 union 包含在 from 子句的子查询中,外层 select 被标记为:derived
  - UNION RESULT: 从 union 表获取结果的 select

  ```sql
  explain select col1,col2 from t1 union select col1,col2 from t2;
  ```

  ![](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/NZKoFQ-NZKoFQ.png)

- table: 这一行的数据是和哪张表相关

- **type: 访问类型(重要)**。结果值从最好到最坏依次是`system > const > eq_ref > ref > fulltext > ref_or_null > index_merge > unique_subquery > index_subquery > range(尽量保证) > index > ALL`

  - system：表中只有一行记录(系统表), 这是 const 类型的特例, 基本上不会出现

  - const：通过索引一次查询就找到了，const 用于比较 primary key 或者 unique 索引，该表最多有一个匹配行, 在查询开始时读取。

    ```sql
    explain select * from t1 where id=1
    ```

  - eq_ref：读取本表中和关联表表中的每行组合成的一行。除 了 system 和 const 类型之外, 这是最好的联接类型。当连接使用索引的所有部分时, 索引是主键或唯一非 NULL 索引时, 将使用该值。

    ```sql
    explain select * from t1,t2 where t1.id = t2.id;
    ```

  - ref ：非唯一性索引扫描，返回匹配某个单独值的所有行，本质上也是一种索引访问，它返回所有符合条件的行。

    ```sql
    explain select * from t1 where col1='zs1';
    ```

  - range: 只检索给定范围的行, 使用一个索引来选择行.key 列显示的是真正使用了哪个索引,一般就是在 where 条件中使用 between,>,<,in 等范围的条件,这种在索引范围内的扫描比全表扫描要好,因为它只在某个范围中扫描,不需要扫描全部的索引

    ```sql
    explain select * from t1 where id between 1 and 10;
    ```

  - index : 扫描整个索引表, index 和 all 的区别为 index 类型只遍历索引树. 这通常比 all 快,因为索引文件通常比数据文件小,虽然 index 和 all 都是读全表,但是 index 是从索引中读取,而 all 是从硬盘中读取数据

    ```sql
    explain select id from t1;
    ```

  - all : 全表扫描 ,将遍历全表以找到匹配的行

    ```sql
    explain select * from t1;
    ```

  > 开发中，要保证访问类型是在 range->ref 级别

- possible_keys: 可能用到的索引

- **key: 查询过程中真正使用的索引(重要)**

  ```sql
  explain select t2.* from t1,t2,t3 where t1.col1 = ' ' and t1.id = t2.id and t1.id= t3.id;
  ```

  ![](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/hJpf20-hJpf20.png)

- key_len: 索引中使用的字节数，可通过该列计算查询中使用的索引的长度，长度越短越好。

- ref: 显示索引的哪一列被使用了,如果可能的话,是一个常数.哪些列或者常量被用于查找索引列上的值

- rows: 根据表统计信息及索引选用的情况,估算找出所需记录要读取的行数 (有多少行记录被优化器读取) ,越少越好

- extra: 包含不适合在其他列中显示但十分重要的额外信息

## 4. 索引优化

通过执行执行计划分析了 SQL 语句后，大概率查询慢的原因是没有索引或者索引失效。

### 什么是索引

​ 索引（Index）是帮助 MySQL 高效获取数据的数据结构。在数据之外，数据库系统还维护着满足特定查找算法的数据结构，这些数据结构以某种方式指向数据，这样就可以在这些数据结构上实现高效的查找算法，这种数据结构就是索引。
​ 一般来说索引本身也很大，不可能全部存储在内存中，因此往往以索引文件的形式存放在磁盘中.。我们平常所说的索引，如果没有特别说明都是指 BTree 索引(平衡多路搜索树)。

### 索引的存储结构

MySQL 中普遍使用 B+Tree 做索引，也就是 BTREE。

**为什么使用 B+树：**

​ B+树是一个**多路平衡查找树**，它和 B 树的主要区别在于:

- B 树中每个节点（叶子节点和非叶子节点）都存储真实数据。而 B+树这种叶子节点存储值，非叶子节点存储键。
- **B 树中一条记录只会出现一次，不会出现重复。而 B+树的键可能出现重复。**
- B+树的叶子节点使用双向链表连接。

​ 基于上述特点，B+树具有如下优势：

- **更少的 IO 次数：**B+树的非叶节点只包含键，而不包含真实数据，因此每个节点存储的记录个数比 B 数多很多（即阶 m 更大），因此 B+树的高度更低，访问时所需要的 IO 次数更少。此外，由于每个节点存储的记录数更多，所以对访问局部性原理的利用更好，缓存命中率更高。
- **更适于范围查询：**在 B 树中进行范围查询时，首先找到要查找的下限，然后对**B 树进行中序遍历**，直到找到查找的上限；而 B+树的范围查询，只需要对**链表进行遍历**即可。
- **更稳定的查询效率：**B 树的查询时间复杂度在 1 到树高之间(分别对应记录在根节点和叶节点)，而 B+树的查询复杂度则稳定为树高，因为所有数据都在叶节点。

但是 B+树也有其自身的缺点，因为键有可能出现重复，所以会占用更多的空间。但对于现代服务器对比性能来说，空间劣势基本都是可以接受的。

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/K3iT66-K3iT66.png" style="zoom: 90%;" />

### 索引的优缺点

- 优点

  - 类似大学图书馆建书目索引，提高数据检索的效率，降低数据库的 IO 成本.
  - 通过索引列对数据进行排序, 降低数据排序的成本，降低了 CPU 的消耗

- 缺点
  - 虽然索引大大提高了查询速度，同时却会降低更新表的速度，如对表进行 INSERT、UPDATE 和 DELETE。因为更新表时，MySQL 不仅要保存数据，还要保存一下索引文件每次更新添加了索引列的字段都会调整。因为更新所带来的键值变化后的索引信息
  - 实际上索引也是一张表，该表保存了主键与索引字段，并指向实体表的记录，所以索引列也是要占用空间的

### 索引的类别

- 普通索引: 最基本的索引，没有任何限制

  ```sql
  CREATE index 索引名 on 表名(列名)
  ```

- 唯一索引: 与普通索引类似，不同是：索引列的值必须唯一，但允许有空值。如果是组合索引，则列值的组合必须唯一。

  ```sql
  CREATE UNIQUE index 索引名 on 表名(列名)
  ```

- 主键索引: 是一种特殊的唯一索引，这个时候需要一个表只能有一个主键，不允许有空值。一般是在建表的时候同时创建主键索引。

- 复合索引: 指多个字段上创建的索引，使用组合索引时遵循最左前缀规格。

  ```sql
  CREATE index 索引名 on 表名(列名,列名...)
  ```

- 全文索引: 主要用来查找文本中的关键字，目前只有**char、varchar，text** 列上可以创建全文索引。

### 索引的基本语法

```sql
# 创建索引
ALTER TABLE ADD [UNIQUE]  INDEX [indexName] ON 表名(列名)
```

```sql
# 删除索引
DROP INDEX [indexName] ON 表名;
```

```sql
# 查看索引
SHOW INDEX FROM 表名
```

示例

```sql
ALTER TABLE tbl_name ADD PRIMARY KEY (column_list): 该语句添加一个主键，这意味着索引值必须是唯一的，且不能为NULL。

ALTER TABLE tbl_name ADD UNIQUE index_name (column_list): 这条语句创建索引的值必须是唯一的（除了NULL外）。

ALTER TABLE tbl_name ADD INDEX index_name (column_list): 添加普通索引，索引值可出现多次。

ALTER TABLE tbl_name ADD FULLTEXT index_name (column_list):该语句指定了索引为 FULLTEXT ，用于全文索引。
```

### 索引失效的 9 种情况

#### 环境准备

```sql
CREATE TABLE staffs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR (24)  NULL DEFAULT '' COMMENT '姓名',
  age INT NOT NULL DEFAULT 0 COMMENT '年龄',
  pos VARCHAR (20) NOT NULL DEFAULT '' COMMENT '职位',
  add_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入职时间'
) CHARSET utf8 COMMENT '员工记录表' ;

INSERT INTO staffs(name,age,pos,add_time) VALUES('zhangsan',18,'manager',NOW());
INSERT INTO staffs(name,age,pos,add_time) VALUES('lisi',19,'dev',NOW());
INSERT INTO staffs(name,age,pos,add_time) VALUES('wangwu',20,'dev',NOW());

SELECT * FROM staffs;

ALTER TABLE staffs ADD INDEX idx_staffs_nameAgePos(name, age, pos);

/*
相当于:
对 name 创建索引 ;
对 name, age 创建了索引 ;
对 name, age, pos 创建了索引 ;
*/
```

- 没有全值匹配: 按照索引值去匹配

  ```sql
  EXPLAIN SELECT * FROM staffs WHERE age = 25;  -- ALL(索引失效)
  EXPLAIN SELECT add_time FROM staffs WHERE age = 25 AND pos = 'dev';  -- ALL(索引失效)
  ```

- 没有遵循最左前缀法则: 如果索引了多列，要遵守**最左前缀法则**。指的是查询从索引的最左前列开始并且不跳过索引中的列。

  ```sql
  -- and 忽略左右关系。既即使没有没有按顺序 由于优化器的存在，会自动优化。
  EXPLAIN SELECT * FROM staffs WHERE age = 25 AND name = 'July' AND pos = 'dev'; -- ref

  EXPLAIN SELECT * FROM staffs WHERE age = 25 AND pos = 'dev'; -- ALL(索引失效)
  ```

- 索引列上做了操作（计算、函数、自动/手动类型转换）

  ```sql
  EXPLAIN SELECT * FROM staffs WHERE left(NAME,4) = 'July';  -- ALL(索引失效)
  ```

- 范围条件右边与范围条件使用的同一个组合索引(**范围条件: bettween、<、>、in 等**)

  ```sql
  # type降级为 range，因为 age 用了范围条件，pos 索引就失效了
  EXPLAIN SELECT * FROM staffs WHERE  name = 'July' AND age > 25 AND pos = 'dev'; -- range(索引失效)
  ```

  ![](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/R6TLdV-R6TLdV.png)

  > 注意: 范围条件右边与范围条件使用的同一个组合索引，右边的才会失效。若是不同索引则不会失效

- 使用了不等于**(!= 或者<>)**，会导致全表扫描。(mysql5.7 有这个问题，8.0 不会)

- 使用了 `is not null`，会导致全表扫描。 (mysql5.7 有这个问题，8.0 不会)

  ```sql
  EXPLAIN SELECT * FROM staffs WHERE  NAME IS NULL; -- ref
  EXPLAIN SELECT * FROM staffs WHERE  NAME IS NOT NULL; -- ALL(索引失效)
  ```

- like 以`%`开头，会导致全表扫描。

  ```sql
  EXPLAIN SELECT * FROM staffs WHERE  NAME LIKE 'J%'; -- range
  EXPLAIN SELECT * FROM staffs WHERE  NAME LIKE '%J'; -- ALL(索引失效)
  ```

- 字符串不加单引号。 ( 底层进行隐式类型转换使索引失效，使用了函数造成索引失效)

  ```sql
  EXPLAIN SELECT * FROM staffs WHERE  NAME = 987 -- ALL(索引失效)
  ```

- 使用`select *`，查哪些字段都要具体写上

# 3. 存储引擎介绍

## 1. InnoDB 存储引擎

**特点：**

1. **InnoDB 存储引擎提供了具有提交、回滚和崩溃恢复能力的事务安全。**相比较 MyISAM 存储引擎，InnoDB 写的处理效率差一点并且会占用更多的磁盘空间保留数据和索引。
2. 提供了对数据库事务 ACID（原子性 Atomicity、一致性 Consistency、隔离性 Isolation、持久性 Durability）的支持，实现了 SQL 标准的四种隔离级别。

3. 设计目标就是处理大容量的数据库系统，MySQL 运行时 InnoDB 会在内存中建立缓冲池，用于缓冲数据和索引。
4. 执行“select count(\*) from table”语句时需要扫描全表，因为使用 innodb 引擎的表不会保存表的具体行数，所以需要扫描整个表才能计算多少行。

5) **InnoDB 引擎是行锁，粒度更小，所以写操作不会锁定全表，在并发较高时，使用 InnoDB 会提升效率。即存在大量 UPDATE/INSERT 操作时，效率较高。**

**使用场景：**

1. 经常 UPDETE/INSERT 的表，使用处理多并发的写请求

2) **支持事务，只能选出 InnoDB。**

3. 可以从灾难中恢复（日志+事务回滚）
4. 外键约束、列属性 AUTO_INCREMENT 支持

## 2. **MyISAM**存储引擎

**特点：**

1. **MyISAM 不支持事务，不支持外键，SELECT/INSERT 为主的应用可以使用该引擎。**

2) 每个 MyISAM 在存储成 3 个文件，扩展名分别是：

1) frm：存储表定义（表结构等信息）

2) MYD(MYData)，存储数据

3) MYI(MYIndex)，存储索引

3. 不同 MyISAM 表的索引文件和数据文件可以放置到不同的路径下。

4) MyISAM 类型的表提供修复的工具，可以用 CHECK TABLE 语句来检查 MyISAM 表健康，并用 REPAIR TABLE 语句修复一个损坏的 MyISAM 表。
5) 在 MySQL5.6 以前，只有 MyISAM 支持 Full-text 全文索引

**使用场景：**

1. 经常 SELECT 的表，插入不频繁，查询非常频繁。
2. 不支持事务。
3. 做很多 count 的计算。

## 3. MyISAM 和 Innodb 区别

​ InnoDB 和 MyISAM 是许多人在使用 MySQL 时最常用的两个存储引擎，这两个存储引擎各有优劣，视具体应用而定。基本的差别为：MyISAM 类型不支持事务处理，而 InnoDB 类型支持。MyISAM 类型强调的是性能，其执行速度比 InnoDB 类型更快，而 InnoDB 提供事务支持已经外部键等高级数据库功能。

**具体实现的差别：**

- MyISAM 是非事务安全型的，而 InnoDB 是事务安全型的。

* MyISAM 锁的粒度是表级，而 InnoDB 支持行级锁定。

- MyISAM 不支持外键，而 InnoDB 支持外键

* MyISAM 相对简单，所以在效率上要优于 InnoDB，小型应用可以考虑使用 MyISAM。
* InnoDB 表比 MyISAM 表更安全。

# 4. 数据库结构优化

## 1. 优化表结构

- 尽量将表字段定义为 NOT NULL 约束，这时由于在 MySQL 中含有空值的列很难进行查询优化，NULL 值会使索引以及索引的统计信息变得很复杂。

- 对于只包含特定类型的字段，可以使用 enum、set 等数据类型。

- 数值型字段的比较比字符串的比较效率高得多，字段类型尽量使用最小、最简单的数据类型。例如 IP 地址可以使用 int 类型。

- 尽量使用 TINYINT（4）、SMALLINT（6）、MEDIUM_INT（8）作为整数类型而非 INT，如果非负则加上 UNSIGNED。

- VARCHAR 的长度只分配真正需要的空间

- 尽量使用 TIMESTAMP 而非 DATETIME，但 TIMESTAMP 只能表示 1970 - 2038 年，比 DATETIME 表示的范围小得多，而且 TIMESTAMP 的值因时区不同而不同。

- 单表不要有太多字段，建议在 20 以内

- 合理的加入冗余字段可以提高查询速度。

## 2. 表拆分

### 垂直拆分

​ 垂直拆分**按照字段进行拆分**，其实就是把组成一行的多个列分开放到不同的表中，这些表具有不同的结构，拆分后的表具有更少的列。例如用户表中的一些字段可能经常访问，可以把这些字段放进一张表里。另外一些不经常使用的信息就可以放进另外一张表里。

​ 插入的时候使用事务，也可以保证两表的数据一致。缺点也很明显，由于拆分出来的两张表存在一对一的关系，需要使用冗余字段，而且需要 join 操作。但是我们可以在使用的时候可以分别取两次，这样的来说既可以避免 join 操作，又可以提高效率。

### 水平拆分

​ 水平拆分**按照行进行拆分**，常见的就是==分库分表==。以用户表为例，可以取用户 ID，然后对 ID 取 10 的余数，将用户均匀的分配进这 0-9 这 10 个表中。查找的时候也按照这种规则，又快又方便。

​ 有些表业务关联比较强，那么可以使用按时间划分的。例如每天的数据量很大，需要每天新建一张表。这种业务类型就是需要高速插入，但是对于查询的效率不太关心。表越大，插入数据所需要索引维护的时间也就越长。

## 3. 写分离

​ 大型网站会有大量的并发访问，如果还是传统的数据存储方案，只是靠一台服务器处理，如此多的数据库连接、读写操作，数据库必然会崩溃，数据丢失的话，后果更是不堪设想。这时候，我们需要考虑如何降低单台服务器的使用压力，提升整个数据库服务的承载能力。

​ 我们发现一般情况对数据库而言都是“读多写少”，也就说对数据库读取数据的压力比较大，这样分析可以采用数据库集群的方案。其中一个是主库，负责写入数据，我们称为写库；其它都是从库，负责读取数据，我们称为读库。这样可以缓解一台服务器的访问压力。

​ MySql 自带主从复制功能，我们可以使用主从复制的主库作为写库，从库和主库进行数据同步，那么可以使用多个从库作为读库，已完成读写分离的效果。

### 4. 数据库集群

​ 如果访问量非常大，虽然使用读写分离能够缓解压力，但是一旦写操作一台服务器都不能承受了，这个时候我们就需要考虑使用多台服务器实现写操作。

例如可以使用 MyCat 搭建 MySql 集群，对 ID 求 3 的余数，这样可以把数据分别存放到 3 台不同的服务器上，由 MyCat 负责维护集群节点的使用。
