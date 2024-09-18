# 分布式搜索引擎 03

# 数据聚合

[聚合（**aggregations**）](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html)可以让我们极其方便的实现对数据的统计、分析、运算。例如：

- 什么品牌的手机最受欢迎？
- 这些手机的平均价格、最高价格、最低价格？
- 这些手机每月的销售情况如何？

实现这些统计功能的比数据库的 sql 要方便的多，而且查询速度非常快，可以实现近实时搜索效果。

## 聚合的种类

聚合常见的有三类：

- **桶（Bucket）**聚合：用来对文档做分组
- TermAggregation：按照文档字段值分组，例如按照品牌值分组、按照国家分组
- Date Histogram：按照日期阶梯分组，例如一周为一组，或者一月为一组
- **度量（Metric）**聚合：用以计算一些值，比如：最大值、最小值、平均值等
- Avg：求平均值
- Max：求最大值
- Min：求最小值
- Stats：同时求 max、min、avg、sum 等
- **管道（pipeline）**聚合：其它聚合的结果为基础做聚合

> **注意：**参加聚合的字段必须是 keyword、日期、数值、布尔类型

## DSL 实现聚合

### 1.Bucket 聚合语法

```json
GET /hotel/_search
{
  "size": 0,  // 设置size为0，结果中不包含文档，只包含聚合结果
  "aggs": { // 定义聚合
    "brandAgg": { //给聚合起个名字
      "terms": { // 聚合的类型，按照品牌值聚合，所以选择term
        "field": "brand", // 参与聚合的字段
        "size": 20 // 希望获取的聚合结果数量
      }
    }
  }
}
```

### 2.聚合结果排序

默认情况下，Bucket 聚合会统计 Bucket 内的文档数量，记为\_count，并且按照\_count 降序排序。

我们可以指定 order 属性，自定义聚合的排序方式：

```
GET /hotel/_search
{
  "size": 0,
  "aggs": {
    "brandAgg": {
      "terms": {
        "field": "brand",
        "order": {
          "_count": "asc" // 按照_count升序排列
        },
        "size": 20
      }
    }
  }
}
```

### 3.限定聚合范围

默认情况下，Bucket 聚合是对索引库的所有文档做聚合，但真实场景下，用户会输入搜索条件，因此聚合必须是对搜索结果聚合。那么聚合必须添加限定条件。

我们可以限定要聚合的文档范围，只要添加 query 条件即可：

```
GET /hotel/_search
{
  "query": {
    "range": {
      "price": {
        "lte": 200 // 只对200元以下的文档聚合
      }
    }
  },
  "size": 0,
  "aggs": {
    "brandAgg": {
      "terms": {
        "field": "brand",
        "size": 20
      }
    }
  }
}
```

### 4.Metric 聚合语法

我们对酒店按照品牌分组，形成了一个个桶。现在我们需要对桶内的酒店做运算，获取每个品牌的用户评分的 min、max、avg 等值。

这就要用到 Metric 聚合了，例如 stat 聚合：就可以获取 min、max、avg 等结果。

```
GET /hotel/_search
{
  "size": 0,
  "aggs": {
    "brandAgg": {
      "terms": {
        "field": "brand",
        "size": 20
      },
      "aggs": { // 是brands聚合的子聚合，也就是分组后对每组分别计算
        "score_stats": { // 聚合名称
          "stats": { // 聚合类型，这里stats可以计算min、max、avg等
            "field": "score" // 聚合字段，这里是score
          }
        }
      }
    }
  }
}
```

## RestAPI 实现聚合

# 自动补全

## 拼音分词器

## 自定义分词器

拼音分词器有很多配置项，大致如下

keep_first_letter：启用此选项时，例如：刘德华 > ldh，默认值：true
keep_separate_first_letter：启用此选项时，将单独保留首字母，例如：刘德华 > l，默认：false，注意：查询结果可能过于模糊
limit_first_letter_length：设置 first_letter 结果的最大长度，默认值：16
keep_full_pinyin：启用此选项时，例如：刘德华 > [ liu, de, hua]，默认值：true
keep_joined_full_pinyin：启用此选项时，例如：刘德华 > [ liudehua]，默认值：false
keep_none_chinese：结果中保留非中文字母或数字，默认值：true
keep_none_chinese_together：将非中文字母保持在一起，默认：true，例如：DJ 音乐家 > DJyinyuejia
keep_none_chinese_in_first_letter：首字母保留非中文字母，例如：刘德华 AT2016 > ldhat2016，默认：true
keep_none_chinese_in_joined_full_pinyin：保留非中文字母加入完整拼音，例如：刘德华 2016 > liudehua2016，默认：false
none_chinese_pinyin_tokenize：如果是拼音，则将非中文字母分成单独的拼音词，默认：true，例如：liudehuaalibaba13zhuanghan > liu, de, hua, a, li, ba, ba, 13, zhuang, han, 注意：需要先启用 keep_none_chinese 和 keep_none_chinese_together
keep_original：启用此选项时，也将保留原始汉字，默认值：false
lowercase：非中文字母转小写，默认：true
trim_whitespace：去空格，默认真
remove_duplicated_term：删除重复的术语以保存索引，例如：de 的 > de，默认：false，注意：位置相关的查询可能会受到影响
ignore_pinyin_offset：6.0 以后，offset 被严格限制，tokens 重叠是不允许的，有了这个参数，tokens 重叠会被忽略 offset，请注意，所有位置相关的查询或高亮都会变得不正确，你应该使用多个字段并为不同的设置指定不同的设置查询目的。如果需要偏移，请将其设置为 false。默认值：true。

## 自动补全查询

```json
// 自动补全查询
GET /test/_search
{
  "suggest": {
    "title_suggest": {
      "text": "s", // 关键字
      "completion": {
        "field": "title", // 补全查询的字段
        "skip_duplicates": true, // 跳过重复的
        "size": 10 // 获取前10条结果
      }
    }
  }
}
```

## 实现酒店搜索框自动补全

# 数据同步

# 集群

搭建 ES 集群

集群脑裂问题

集群分布式存储

集群分布式查询

集群故障转移
