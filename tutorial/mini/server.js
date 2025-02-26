const express = require('express');
const cors = require('cors');
const bodyParse = require('body-parser');
const app = express();
app.use(cors());

app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
app.use(bodyParse.text());

app.post('/reportData', (req, res) => {
    console.log(req.body);
    res.status(200).send('ok');
});
app.listen(9800, () => {
    console.log('server is running on 9800');
});