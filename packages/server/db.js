const mongoose = require("mongoose");

const dbURL = "mongodb://localhost:27017/monitor-actions";

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(res => {
    console.log("数据库连接成功");
  })
  .catch(err => {
    console.log(err);
  });
