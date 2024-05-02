const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const filePath = path.resolve(__dirname,'./1.js');
const hash = crypto.createHash('SHA256');
const stream  = fs.createReadStream(filePath);

stream.on('data',(data)=>{
    hash.update(data);
});
stream.on('end',(data)=>{
    const hashValue = hash.digest('hex');
    console.log(hashValue)
    //7b273ebb90e3ecd502d71de192a1ef729f34a6b40aecfa6e0d37caee3f406284
});