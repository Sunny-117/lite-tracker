# mysql设置支持emoji



```bash
(node:18184) UnhandledPromiseRejectionWarning: Error: ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: Incorrect string value: '\xF0\x9F\x8E\x89 E...' for column 'title' at row 1
```

原因在于mysql数据库编码格式**utf8**默认保存的是1到3个字节，而emoji表情采用4个字节保存，所以抛出异常。因此需要将编码格式转换为**utf8mb4**（mysql版本大于**5.5**）



#### 设置数据库编码

```bash
# 设置编码
SET NAMES utf8mb4; 
ALTER DATABASE `database_name` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci;
```



#### 查看数据库当前编码状态

```bash
SHOW VARIABLES WHERE Variable_name LIKE 'character_set_%' OR Variable_name LIKE 'collation%';
```

打印出来是这样的

```bash
mysql> SHOW VARIABLES WHERE Variable_name LIKE 'character_set_%' OR Variable_name LIKE 'collation%';
+--------------------------+-----------------------------------------------------------+
| Variable_name            | Value                                                     |
+--------------------------+-----------------------------------------------------------+
| character_set_client     | utf8mb4                                                   |
| character_set_connection | utf8mb4                                                   |
| character_set_database   | utf8mb4                                                   |
| character_set_filesystem | binary                                                    |
| character_set_results    | utf8mb4                                                   |
| character_set_server     | utf8mb4                                                   |
| character_set_system     | utf8                                                      |
| character_sets_dir       | /usr/local/mysql-8.0.17-macos10.14-x86_64/share/charsets/ |
| collation_connection     | utf8mb4_0900_ai_ci                                        |
| collation_database       | utf8mb4_general_ci                                        |
| collation_server         | utf8mb4_0900_ai_ci                                        |
+--------------------------+-----------------------------------------------------------+
11 rows in set (0.00 sec)
 
mysql> 
```



#### 设置mysql库连接时的编码

```js
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'blog',
    user: 'root',
    password: '12345678',
    charset : 'utf8mb4'
});
```
