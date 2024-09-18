const express = require('./express');
const userRouter =require('./routes/userRouter');

const app = express();


app.use('/user',userRouter);

app.listen(3000);