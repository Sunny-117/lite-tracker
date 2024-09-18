# mongoose 的应用

### 1.搭建骨架

```js
const mongoose = require('mongoose');

let conn = mongoose.createConnection(
  'mongodb://zwh:zwh@localhost:27017/school',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

conn.on('connected', () => {
  console.log('连接成功');
});

// Schema，骨架，根据这个骨架来规范文档
let StudentSchema = new mongoose.Schema(
  {
    // 文档内容校验
    username: {
      type: String,
      required: true,
    },
    password: String,
    age: Number,
    birthday: {
      type: Date,
      default: Date.now,
    },
    hobby: [],
  },
  {
    collection: 'Student', // 可选，固定集合名字。不填是 students
    timestamps: {
      // 可选，创建和修改数据
      createAt: 'createTime',
      updateAt: 'updateTime',
    },
  },
);

let Student = conn.model('Student', StudentSchema); // 根据骨架创建集合

let doc = { username: 'zwh', password: 'zwh', age: 18 };
// let doc = { username: 'zwh2', password: 'zwh2', age: 18, a: 1 }; // 多余的字段会忽略
// let doc = { username: 'zwh3', age: 18 }; // 非必填的字段，可以缺少
Student.create(doc).then(doc => {
  console.log(doc);
  conn.close();
});
```

### 2.插入数据

```js
// 单条插入
let docs = Student.create({ username: 'zwh', password: 'zwh', age: 18 });
console.log(docs);

// 批量插入
let arr = [];
for (let i = 0; i < 10; i++) {
  arr.push({ username: 'zwh' + i, password: 'zwh' + i, age: i });
}
let docs = await Student.create(arr);
console.log(docs);
```

### 3.查询数据

第一个参数是查询条件，第二个参数是控制要返回的字段，1: true, 0: false

> 第二个参数除了 \_id 之外，只能全部 1 或者全部 0，不能混用

- findOne 单条查询，返回对象
- find 多条查询，返回数组
- findById 根据 id 查询，返回对象

```js
// 单条查询
let docs = await Student.findOne({ age: 1 });

// 多条查询
let docs = await Student.find({ age: 1 });

// 根据 id 查询
let docs = await Student.findById('5ef5f7095d185f27b88ec62b');

// 控制要返回的字段
let docs = await Student.find({ age: 1 }, { username: 1, age: 1 });
/*
[
  { _id: 5f8d73b4363ae5dece666c4b, username: 'zwh1', age: 1 },
  { _id: 5f8d76c82a7022df2d85be8e, username: 'zwh10', age: 1 }
]
*/

// and 多条件查询，username 为 zwh，且 age 为 1 的数据
let docs = await Student.find({ username: 'zwh', age: 1 });

// or 多条件查询，username 为 zwh，或 age 为 1 的数据
let docs = await Student.find({ $or: [{ username: 'zwh' }, { age: 1 }] });
```

### 4.更新数据

第一个参数是查询条件（和查询用法一致），第二个参数是更新操作

- updateOne 更新第一条
- updateMany 更新

> $lt 小于
> $lte 小于等于
> $gt 大于
> $gte 大于等于
> $inc 递增
> $set 设置数据
> $push 操作值为数组的属性，新增元素
> $addToSet 操作值为数组的属性，添加元素(如果数组里有，则忽略)

```js
// 年龄小于 2的，age 增加 10
let docs = await Student.updateOne({ age: { $lt: 2 } }, { $inc: { age: 10 } });

// 正则匹配 username 带有 zwh，第一条密码设置为 123456
let docs = await Student.updateOne(
  { username: /zwh/ },
  { $set: { password: '123456' } },
);

// 正则匹配 username 带有 zwh，第一条 hobby 设置为数组(原来没有，则是增加)
let docs = await Student.updateOne(
  { username: /zwh/ },
  { $set: { hobby: ['吃饭'] } },
);

// 正则匹配 username 带有 zwh，第一条 hobby 的数组增加元素
let docs = await Student.updateOne(
  { username: /zwh/ },
  { $push: { hobby: ['睡觉'] } },
);
```

```js
/* 1 */
{
    "_id" : ObjectId("5f8d73b4363ae5dece666c4b"),
    "username" : "zwh1",
    "password" : "123456",
    "age" : 21,
    "birthday" : ISODate("2019-10-19T11:08:36.742Z"),
    "__v" : 0,
    "hobby" : [ "吃饭", "睡觉" ]
}

/* 2 */
{
    "_id" : ObjectId("5f8d73b4363ae5dece666c4e"),
    "username" : "zwh4",
    "password" : "123456",
    "age" : 4,
    "birthday" : ISODate("2019-10-19T11:08:36.743Z"),
    "__v" : 0
}
```

### 5.删除数据

- deleteOne 单条删除
- deleteMany 多条删除

```js
// 单条删除
let docs = await Student.deleteOne({ age: 1 });

// 多条删除
let docs = await Student.deleteMany({ age: 1 });
```

### 6.分页查询

执行顺序是固定的。先查询出数据，再根据 age 倒序排序 ，再跳过 skip 的数据，最后根据 limit 添加限制返回的数据。不会根据方法位置改变执行顺序。

> find 返回的是一个游标指针，并不是结果

```js
let limit = 2;
let currentPage = 2;

let docs = await Student.find({})
  .limit(limit)
  .skip((currentPage - 1) * limit)
  .sort({ age: -1 });
```

### 7.表的关联

```js
const mongoose = require('mongoose');

const conn = mongoose.createConnection(
  'mongodb://zwh:zwh@localhost:27017/school',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);
let StudentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: String,
    age: Number,
    birthday: {
      type: Date,
      default: Date.now,
    },
    hobby: [],
  },
  { collection: 'Student' },
);
let Student = conn.model('Student', StudentSchema);

let HomeWorkSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    student: {
      ref: 'Student',
      type: mongoose.SchemaTypes.ObjectId, // 用户的id号
    },
  },
  { collection: 'Homework' },
);
let HomeWork = conn.model('Homework', HomeWorkSchema);

(async () => {
  let user = await Student.create({ username: 'zwh', password: 'zwh' });
  let home = await HomeWork.create({
    title: '标题',
    content: '内容',
    student: user._id,
  });
  console.log(home);

  /*
  {
    _id: 5f8d87c0567e2ae1016aea4e,
    title: '标题',
    content: '内容',
    student: 5f8d87c0567e2ae1016aea4d,
    __v: 0
  }
  */

  // .populate('student', { username: 1 })  可以控制要返回的字段
  let doc = await HomeWork.findById('5f8d87c0567e2ae1016aea4e').populate(
    'student',
  );
  console.log(doc);

  /*
  {
    _id: 5f8d87c0567e2ae1016aea4e,
    title: '标题',
    content: '内容',
    student: {
      hobby: [],
      _id: 5f8d87c0567e2ae1016aea4d,
      username: 'zwh',
      password: 'zwh',
      birthday: 2019-10-19T12:34:08.265Z,
      __v: 0
    },
    __v: 0
  }
  */

  conn.close();
})();
```

```json
// Student集合
{
    "_id" : ObjectId("5f8d87c0567e2ae1016aea4d"),
    "hobby" : [],
    "username" : "zwh",
    "password" : "zwh",
    "birthday" : ISODate("2019-10-19T12:34:08.265Z"),
    "__v" : 0
}

//HomeWork集合
{
    "_id" : ObjectId("5f8d87c0567e2ae1016aea4e"),
    "title" : "标题",
    "content" : "内容",
    "student" : ObjectId("5f8d87c0567e2ae1016aea4d"),
    "__v" : 0
}
```

其他

```js
const Student = require('./models/student');
const HomeWork = require('./models/homework');
const conn = require('./db');
const mongoose = require('mongoose');
(async () => {
  let homework = await HomeWork.aggregate([
    {
      $lookup: {
        // 关联
        from: 'student', // 查询哪个表
        localField: 'studentId', // 当前homework中的key
        foreignField: '_id', // 关联谁
        as: 'user',
      },
    },
    {
      $limit: 1,
    },
    // {
    //     $project:{ // 查询显示结果
    //         title:1
    //     }
    // },
    // {
    //     $group:{
    //         _id:"$username"
    //     }
    // },
    // {
    //     $match:{ // 匹配规则
    //         _id:  mongoose.Types.ObjectId('5f89a32916082530c4380041')
    //     }
    // }
  ]);
  console.log(homework);
})();
```
