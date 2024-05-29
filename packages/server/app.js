const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const { UserAction, ErrorLog, BehaviorLog, ApiLog, PerformanceLog }  = require("./models/index");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());


app.use("/api/test", async (req, res) => {
  const error = req.query.error;
  if (error) {
    //发送500错误信息
    res.status(500).send("服务器错误");
  }
  else { 
    //发送正确的响应
    res.send("发送成功");
  }
  
})

app.use("/api/get/apiLog", async (req, res) => {
  const page = req.query.page || 1;
  const total = await ApiLog.find().count();
  const data = await ApiLog.find()
    .sort({ createTime: -1 })
    .limit(10)
    .skip(10 * (page - 1));
  res.json({
    total,
    pages: Math.ceil(total / 10),
    data
  });
})

app.use("/api/get/actionLog", async (req, res) => {
  const page = req.query.page || 1;
  const total = await UserAction.find().count();
  const data = await UserAction.find()
    .sort({ createTime: -1 })
    .limit(10)
    .skip(10 * (page - 1));
  res.json({
    total,
    pages: Math.ceil(total / 10),
    data
  });
})

app.get("/api/get/errorLog", async (req, res) => {
  const page = req.query.page || 1;
  const total = await ErrorLog.find().count();
  const data = await ErrorLog.find()
    .sort({ createTime: -1 })
    .limit(10)
    .skip(10 * (page - 1));
  res.send({
    total,
    pages: Math.ceil(total / 10),
    data
  });
})

app.get("/api/get/performanceLog", async (req, res) => {
  const page = req.query.page || 1;
  const total = await PerformanceLog.find().count();
  const data = await PerformanceLog.find()
    .sort({ createTime: -1 })
    .limit(10)
    .skip(10 * (page - 1));
  res.send({
    total,
    pages: Math.ceil(total / 10),
    data
  });
})

app.use("/api/get/behaviorLog", async (req, res) => {
  const page = req.query.page || 1;
  const total = await BehaviorLog.find().count();
  const data = await BehaviorLog.find()
    .sort({ createTime: -1 })
    .limit(10)
    .skip(10 * (page - 1));
  res.json({
    total,
    pages: Math.ceil(total / 10),
    data
  });
})


app.use("/report/actions", async (req, res) => {
  
  const logs = typeof req.body === 'object' ? req.body : JSON.parse(req.body);

  const { id, appId, userId, type, data, currentTime, currentPage, ua } = logs; 
  console.log(logs);
  
  /*
  const errorLog = new ErrorLog({
    id,
    appId,
    userId,
    filename: data.filename,
    functionName: data.functionName,
    errorType: data.errorType,
    tagName: data.tagName,
    errMsg: data.message,
    stack: data.stack,
    colno: data.colno,
    lineno: data.lineno,
    createTime: currentTime,
    currentPage, 
    ua
  });

  await errorLog.save();
  */

  data?.forEach(async item => {
    switch (type) {
      case 'action':
        const userAction = new UserAction({
          id,
          appId,
          userId,
          eventType: item.eventType,
          tagName: item.tagName,
          value: item.value,
          timeStamp: item.timeStamp,
          paths: item.paths,
          x: item.x,
          y: item.y,
          createTime: currentTime,
          currentPage, 
          ua
        });
        await userAction.save();
        break;
      case 'error':
        const errorLog = new ErrorLog({
          id,
          appId,
          userId,
          filename: item.filename,
          functionName: item.functionName,
          errorType: item.errorType,
          tagName: item.tagName,
          errMsg: item.message,
          stack: item.stack,
          colno: item.colno,
          lineno: item.lineno,
          createTime: currentTime,
          currentPage, 
          ua
        });
        await errorLog.save();
        break;
      case 'behavior':
        const behaviorLog = new BehaviorLog({
          id,
          appId,
          userId,
          subType: item.subType,
          referrer: item.referrer,
          effectiveType: item.effectiveType,
          rtt: item.rtt,
          stayTime: item.stayTime,
          from: item.from,
          to: item.to,
          params: item.params,
          query: item.query,
          name: item.name,
          createTime: currentTime,
          currentPage,
          ua,
        });
        await behaviorLog.save();
        break;
      case 'api':
        const apiLog = new ApiLog({
          id,
          appId,
          userId,
          subType: item.subType,
          method: item.method,
          url: item.url,
          status: item.status,
          startTime: item.startTime,
          endTime: item.endTime,
          duration: item.duration,
          success: item.success,
          createTime: currentTime,
          currentPage,
          ua,
        });
        await apiLog.save();
        break;
      case 'performance':
        const performanceLog = new PerformanceLog({
          id,
          appId,
          userId,
          name: item.name,
          value: item.value,
          rating: item.rating,
          delta: item.delta,
          createTime: currentTime,
          currentPage, 
          ua
        });
        await performanceLog.save();
        break;
      default:
        break;
    }
  })

  res.send("发送成功");
});

app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    code: "error",
    info: err
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
require("./db");

