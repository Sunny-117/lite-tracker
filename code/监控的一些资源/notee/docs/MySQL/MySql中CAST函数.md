# MySql 中 CAST 函数

- 语法：`CAST( value AS type )`

#### type 的类型

| value    | 描述                                            |
| -------- | ----------------------------------------------- |
| DATE     | 日期，格式为 'YYYY-MM-DD'.                      |
| DATETIME | 日期加具体的时间，格式为 'YYYY-MM-DD HH:MM:SS'. |
| TIME     | 时间，格式为 'HH:MM:SS'.                        |
| CHAR     | 字符型                                          |
| SIGNED   | int                                             |
| UNSIGNED | 无符号 int                                      |
| BINARY   | 二进制型                                        |
| DECIMAL  | float 型                                        |

#### 示例：

```mysql
select cast(20.3456 as decimal(10, 2)) as num
//结果：20.35
select cast('2019-03-08 15:31:26' as datetime ) as date
//结果：2019-03-08 15:31:26
select cast('2019-03-08 15:31:26' as date ) as date
//结果：2019-03-08
select cast('2019-03-08 15:31:26' as time ) as date
//结果：15:31:26
select cast('2015-11-03 15:31:26' as char ) as date
//结果：2015-11-03 15:31:26
```
