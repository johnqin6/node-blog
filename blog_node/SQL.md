# mysql 命令总结

## mysql概述  
mysql是关系型数据库，一个关系型数据库由一个或数个表格组成，结构如下：    

| id | name | parent_id | level |
|----|------|---------|--------|   
| 1  | 北京市| 0  | 1 |     
| 2  | 天津市| 0  | 1 |   
| 3  | 上海市| 0  | 1 |  

- 表头(header): 每一列的名称  
- 列(col): 具有相同数据类型的数据的集合  
- 行(row): 每一行用来描述某一人/物的具体信息  
- 值(value): 行的具体信息，每一个值必须与该列的数据类型相同  
- 键(key): 表中用来识别某个特定的人物的方法，键的值在当前列中具有唯一键   
## 登录MYSQL  

```javascript
// 登录mysql 
mysql -h 127.0.0.1 -u 用户名 -p 
// 或  
mysql -D 所选择的数据库名 -h 主机名 -u 用户名 -p 
// 退出
mysql> exit // 或 'quit' 或 '\q'
// 显示当前mysql的version的各种信息
mysql> status; 
// 显示当前mysql的version信息 
mysql> select version();
// 查看mysql端口号
mysql> show global variables like 'port';
```

## 创建数据库

```javascript
// 创建一个名为text的数据库，数据库字符编码指定为 gbk
create database text character set gbk 
// 删除 库名为text的库  
drop database text
// 显示数据库列表
show databases
// 使用text数据库 
use text
// 显示text数据库下的数据表
show tables
// 显示数据表的结构
describe 表名
// 清空表中记录
delete from 表名
```

## 创建数据库表  

> 使用`create table`语句可完成对表的创建，`create table`的常见形式：  
> 语法：create table 表名称(列声明)

建表示例：    
```SQL
CREATE TABLE `USER_accounts` (
  'id'       int(100) unsigned NOT NULL  AUTO_INCREMENT primary key,
  password varchar(32)         NOT NULL  DEFAULT '' COMMENT '用户密码',
  `reset_password` tinyint(32) NOT NULL  DEFAULT 0  COMMENT '用户类型：0-不需要重置密码；1-需要重置密码',
  `mobile` varchar(20)         NOT NULL  DEFAULT '' COMMENT '手机',
  `create_at` timestamp(6)     NOT NULL  DEFAULT CURRENT_TIMESTAMP(6),
  `update_at` timestamp(6)     NOT NULL  DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  -- 创建唯一索引，不允许重复--
  UNIQUE INDEX idx_user_mobile(`mobile`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8
comment='用户表信息';

```

### 数据类型的属性解释  
- NULL: 数据列可包含NULL值
- NOT NULL: 数据列不允许包含NULL值
- DEFAULT: 默认值
- PRIMARY: KEY主键
- AUTO_INCREMENT: 自动递增，使用于整数类型
- UNSIGNED: 是指数值类型只能为正数
- CHARACTER SET name: 指定一个字符集
- COMMENT: 对表获取字段说明

## 增删改查 

### SELECT(查)  

> SELECT 语句用于从表中选取数据
> 语法：SELECT 列名称 FROM 表名称
> 语法：SELECT * FROM 表名称  

```SQL
-- 表station取个别名叫s, 表station中不包含 字段id=13或14的，并且id不等于4的 查询出来，只显示id 
SELECT S.id from station s WHERE id (13, 14) and user_id not in (4)

-- 从表persons 选取 lastName 列的数据
SELECT lastName FROM psersons;

-- 结果集中会自动去重数据
SELECT DISTINCT company FROM orders;

-- 表 persons字段id_p 等于 orders字段 id_p 的值  
-- 结果集显示 persons表的 lastName、firstName字段，orders表的orderNo字段
SELECT p.lastName, p.firstName, o.orderNo FROM persons p, orders o WHERE p.id_p = o.id_p;  

-- gbk 和 utf8 中英文混合排序最简单的办法
-- ci是 case insensitive, 即 ‘大小写不敏感’
SELECT tag, COUNT(tag) from news GROUP BY tag order by convert(tag using gbk) collate gbk_chinese_ci;     
SELECT tag, COUNT(tag) from news GROUP BY tag order by convert(tag using utf8) utf8_unicode_ci

```

### UPDATE (更新)

> `update` 语句用于修改表中的数据
> 语法：UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值  

```SQL
-- 更新orders中 id = 1 的那一行数据更新它的title字段
UPDATE `orders` set title='这里是标题' WHERE id=1;

-- update 语句设置字段值为另一个结果取出来的字段
update user set name = (select name from user1 where user1 .id = 1) 
where id = (select id from user2 where user2 .name='小苏');
```

## INSERT (插入)

> `INSERT INTO` 语句用于向表格中插入新的行
> 语法：INSERT INTO 表名称 VALUES (值1, 值2, ...)
> 语法：INSERT INTO 表名称 (列1, 列2, ...) VALUES (值1, 值2,...) 

```SQL
-- 向表 persons 插入一条字段 lastName = JSLite 字段 address = shanghai
INSERT INTO persons (lastName, address) VALUES ('JSLite', 'shanghai');

-- 向表 meeting 插入字段 a=1 和字段 b=2
INSERT INTO meeting SET a=1,b=2;

-- SQL实现将一个表的数据插入到另一个表的代码
-- 如果只希望导入指定字段，可以用这种方法：
-- INSERT INTO 目标表 (字段1, 字段2,...) SELECT 字段1，字段2，... FROM 来源表
INSERT INTO orders (user_account_idm title) SELECT m.user_id, m.title FROM meeting m where m.id = 1;  
```

### DELETE(删除)

> DELETE语句用于删除表中的行
> 语法：DELETE FROM 表名称 WHERE 列名称 = 值   

```SQL
-- 在不删除table_name表的情况下删除所有的行，清空表
DELETE FROM table_name 
-- 或者
DELETE * FROM table_name
-- 删除persons表字段 lastName = 'JSLite'
DELETE FROM persons WHERE lastName = 'JSLite'
-- 删除 表meeting id 为2和3的两条数据
DEKETE FROM meeting WHERE id in (2,3);
```

## WHERE子句

> WHERE子句用于规定选择的标准
> 语法：SELECT 列名称 FROM 表名称 WHERE 列 运算符 值

```SQL
-- 从表 persons 中选出year 字段大于1965的数据
SELECT * FROM persons WHERE year > 1965;
```

### AND 和 OR

> AND: 如果第一个条件和第二个条件都成立
> OR: 如果第一个条件或第二个条件成立

- AND (并且，和)
```SQL
-- 删除 meeting表字段
-- id = 2并且 user_id=5的数据 和
-- id = 3 并且 user_id=6的数据
DELETE FROM meeting WHERE id in (2,3) and user_id in (5,6);

-- 使用 AND 来显示所有姓为‘carter’并且名为'thomas'的人
SELECT * FROM persons WHERE firstName='thomas' AND lastName='carter';
```

- OR(或)
```SQL
-- 使用OR来显示所有姓为'carter'或名为'thomas'的人
SELECT * FROM persons WHERE firstname='thomas' OR lastname='carter';
```

### ORDER BY(排序)
> 语句默认按照升序对记录进行排序
> ORDER BY - 语句用于根据指定的列对结果集进行排序
> DESC - 按照降序对记录进行排序
> ASC - 按照顺序对记录进行排序

```SQL
-- company 在表orders中为字母，则会以字母顺序显示公司名称
SELECT company, orderNumber FROM orders ORDER BY company;

-- 后跟DESC则为降序显示
SELECT company, orderNumber FROM orders ORDER BY company DESC;

-- Company以降序显示公司名称，并OrderNumber以顺序显示
SELECT company, orderNumber FROM orders ORDER BY company DESC, orderNumber ASC;
```

### IN(指定范围，多个值)
> IN- 操作符允许我们在WHERE子句规定多个值
> IN- 操作符用来指定范围，范围中的每一条，都进行匹配。
> 语法：SELETE "字段名" FROM "表格名" WHERE "字段名" IN ('值1','值2',...)

```SQL
-- 从表person选取字段lastName等于adams,carter
SELECT * FROM persons WHERE lastName IN ('adams', 'carter')
```

### NOR(取反)
> NOT- 操作符总是与其他操作符一起使用，用在要过滤前面的

```SQL
SELECT vend_id, prod_name FROM products WHERE NOT vend_id = 'DLL01' ORDER BY prod_name;
```

### UNION
> UNION- 操作符用于合并两个或多个SELECT语句的结果集

```SQL
-- 列出所有在中国表（Employees_China）和美国（Employees_USA）的不同的雇员名
SELECT E_Name FROM Empoyees_China UNION SELECT E_Name FROM Employees_USA;

-- 列出 meeting 表中的 pic_url，
-- station 表中的 number_station 别名设置成 pic_url 避免字段不一样报错
-- 按更新时间排序
SELECT id, pic_url FROM meeting UNION ALL SELECT id, number_station AS pic_url FROM station ORDER BY update_at;
```
### AS(重命名,别名)
> as- 可理解为：用作，当成，作为，别名
> 一般是重命名列名或表名
> 语法：select coulumn_1 as 列1，column2 as 列2 from table as 表  

```SQL
-- 查找所有Employee 表里面的数据并把Employee表命名为emp
SELECT * FROM Employee AS emp;
-- 列出表orders字段orderPrice列最大值
-- 结果集列不显示orderPrice显示largestOrderPrice
SELECT MAX(orderPrice) AS largestOrderPrice FROM Orders;

-- 显示表users_profile中的name列
SELECT t.name from (SELECT * FROM users_profile a) AS t;

-- 表 user_accounts 命名别名 ua，表 users_profile 命名别名 up
-- 满足条件 表 user_accounts 字段 id 等于 表 users_profile 字段 user_id
-- 结果集只显示mobile、name两列
SELECT ua.mobile, up.name FROM user_accounts as ua INNER JOIN users_profile as up ON ua.id = up.user_id;
```

### JOIN(多表查询)
> 用于根据两个或多个表中的列之间的关系，从这些表中查询数据

- JOIN: 如果表中有至少一个匹配，则返回行
- INNER JOIN: 在表中存在至少一个匹配时，INNER JOIN关键字返回行
- LEFT JOIN: 即使右表中没有匹配的，也从左表中返回所有的行
- RIGHT JOIN: 即使左表中没有匹配的，也从右表中返回所有的行
- FULL JOIN: 只要其中一个表中存在匹配，就返回行

```SQL
SELECT persons.lastName, persons.firstName, orders.orderNo FROM persons 
INNER JOIN orders
ON persons.id_p = orders.id_p
ORDER BY persons.lastName
```

## SQL函数

### COUNT 
> COUNT 统计查询的条数
> 语法：SELECT COUNT('字段名') FROM '表格名';

```SQL
-- 表 Store_Information 有几笔 store_name 栏不是空白的资料。
-- "IS NOT NULL" 是 "这个栏位不是空白" 的意思。
SELECT COUNT (Store_Name) FROM Store_Information WHERE Store_Name IS NOT NULL;
-- 获取persons表的记录总数
SELECT COUNT(1) AS totals FROM persons;
-- 获取表 station字段user_id相同的总数
SELECT user_id, count(*) as totals from station group by user_id;
```

### MAX(最大值)
> 返回一列中的最大值, NULL值不包括在计算中
> 语法：SELECT MAX('字段名') FROM '表格名'

```SQL
-- 列出表 Orders 字段 OrderPrice 列最大值，
-- 结果集列不显示 OrderPrice 显示 LargestOrderPrice
SELECT MAX(orderPrice) AS LargestOrderPrice;
```

## 触发器
> 语法：
> create trigger `<触发器名称>`
> { before | after } # 之前或之后触发
> insert | update | delete # 指明了激活触发程序的语句的类型
> on `<表名>` # 操作那张表
> for each row # 触发器的执行间隔，for each row 通知触发器每隔一行执行一次动作，而不是对> 整个表执行一次
> `<触发器SQL语句>`

```SQL
DELIMITER $ -- 自定义结束符号
CREATE TRIGGER set_userdate BEFORE INSERT
on `message`
for EACH ROW
BEGIN 
UPDATE `user_accounts` SET status=1 WHERE openid=NEW.openid;
END
$
DELIMITER ; --恢复结束符号
```

- OLD和NEW不区分大小写
  + NEW 用NEW.col_name，没有旧行。在DELETE触发程序中，仅能使用OLD.col_name，没有新行
  + OLD 用OLD.col_name来引用更新前的某一行的列  

## 添加索引

### 普通索引
> 语法：ALTER TABLE 表名称 ADD INDEX 索引名称(字段名称)

```SQL
-- 直接创建索引
CREATE INDEX index_user ON user(title)
-- 修改表结构的方式添加索引
ALTER TABLE table_name ADD INDEX index_name ON (column(length))
-- 给user表中的name字段 添加普通索引(INDEX)
ALTER TABLE `table` ADD INDEX index_name (name)
-- 创建表的时候同时创建索引
CREATE TABLE `table` (
  `id` int(11) NOT NULL AUTO_INCREMENT ,
  `title` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL ,
  `time` int(10) NULL DEFAULT NULL ,
  PRIMARY KEY (`id`),
  INDEX index_name (title(length))
)

-- 删除索引
DROP INDEX index_name ON table
```

### 主键索引(PRIMARY key)
> 语法：ALTER TABLE 表名称 ADD PRIMARY KEY(字段名称)

```SQL
ALTER TABLE `user` ADD PRIMARY key (id);
```

### 唯一索引(UNIQUE)  
> 语法：ALTER TABLE 表名称 ADD UNIQUE(字段名称)

```SQL
--  给 user 表中的 creattime 字段添加唯一索引(UNIQUE)
ALTER TABLE `user` ADD UNIQUE (creattime);
```

### 全文索引(FULLTEXT)
> 语法：ALTER TABLE 表名称 ADD FULLTEXT(字段名称)  

```SQL
-- 给 user 表中的 description 字段添加全文索引(FULLTEXT)
ALTER TABLE `user` ADD FULLTEXT (description);
```

### 添加多列索引
> 语法：ALTER TABLE table_name ADD INDEX index_name ( column1, column2, column3)  

```SQL
-- 给 user 表中的 name、city、age 字段添加名字为name_city_age的普通索引(INDEX)
ALTER TABLE user ADD INDEX name_city_age (name(10),city,age); 
```

### 建立索引的时机  
在`where`和`join`中出现的列需要建立索引，但也不会完全如此：
- mysql只对<,<=,=,>,>=, BETWEEN, IN使用索引
- 某些时候的`link`也会使用索引
- 在`link`以通配符%和_开头做查询时，mysql不会使用索引  

```SQL
-- 此时就需要对city和age建立索引，
-- 由于mytable表的userame也出现在了JOIN子句中，也有对它建立索引的必要。
SELECT t.Name  
FROM mytable t LEFT JOIN mytable m ON t.Name=m.username 
WHERE m.age=20 AND m.city='上海';

SELECT * FROM mytable WHERE username like'admin%'; -- 而下句就不会使用：
SELECT * FROM mytable WHEREt Name like'%admin'; -- 因此，在使用LIKE时应注意以上的区别。
```
索引的注意事项：
- 索引不会包含有NULL值的列
- 使用短索引
- 不要在列上进行运算 索引会失效  

## 创建表后的修改

### 添加列
> 语法：alter table 表名 add 列名 列数据类型 [after 插入位置];

示例：  
```SQL
-- 在表students的最后追加列 address:
alter table students add address char(60);
-- 在名为 age 的列后插入列 birthday: 
alter table students add birthday date after age;
-- 在名为 number_people 的列后插入列 weeks:
alter table students add column `weeks` varchar(5) not null default '' after `number_people`;
```

### 修改列
> 语法：alter table 表名 change 列名称 列新名称 新数据类型

```SQL
-- 将表 tel 列改名为 telphone: 
alter table students change tel telphone char(13) default '-';
-- 将 name 列的数据类型改为 char(16): 
alter table students change name name char(16) not null;
-- 修改 COMMENT 前面必须得有类型属性
alter table students change name name char(16) COMMENT '这里是名字';
-- 修改列属性的时候 建议使用modify,不需要重建表
-- change用于修改列名字，这个需要重建表
alter table meeting modify `weeks` varchar(20) NOT NULL DEFAULT "" COMMENT "开放日期 周一到周日：0~6，间隔用英文逗号隔开";
```

### 删除列
> 语法：alter table 表名 drop 列名称

```SQL
-- 删除表students中的 birthday 列:
alter table students drop birthday;
```

### 重命名表
> 语法：alter table 表名 rename 新表名;

```SQL
-- 重命名 students 表为 workmates: 
alter table students rename workmates;
```

### 清空表记录
> 方法一：deltet from 表名
> 方法二：truncate from "表名"  

- DELETE: 
  1. DML语言
  2. 可以回退
  3. 可以有条件的删除
- TRUNCATE:
  1. DML语言
  2. 不可以回退  
  3. 默认所有的表的表内容 

```SQL
-- 清空表为 workmates 里面的数据，不删除表。 
delete from workmates;
-- 删除workmates表中的所有数据，且无法恢复
truncate from workmates;
```

### 删除整张表
```sql
-- 删除workmates
drop table workmates
```

### 删除整个数据库
```sql
-- 删除 samp_db 数据库
drop database samp_db;
```
