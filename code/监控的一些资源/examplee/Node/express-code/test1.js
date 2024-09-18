const express = require('./express');
const app = express(); 

app.use((req, res, next) => {
  console.log(1);
  next();
})

app.get('/add', (req, res, next) => {
  console.log(2);
  next();
}, (req, res, next) => {
  console.log(3);
})

app.get('/add', (req, res, next) => {
  res.end('ok');
})

app.listen(3000);
