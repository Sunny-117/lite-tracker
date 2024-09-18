const Promise = require('./promise5');

const fs = require("fs");


new Promise((resolve, reject) => {
  resolve('xxx')
}).then().then().then(data => {
  console.log("data", data)
}, err => {
  console.log("err", err)
});
