let { readLine } = require('lei-stream');
let path = require('path');
let fs = require('fs');

let onDataIn = async (data, next) => {
    data = data.toString();
    let tname = "CREATE TABLE  IF NOT EXISTS  `t_o_project`";
    let tableNameReg = /TABLE.+`(.+)`/;
    let fieldNameReg = /  `(.+)`/;
    let result = data.match(tableNameReg);
    if(result){
        console.log(`${result[1]}`);
        console.log(`|字段|备注|`);
        console.log(`|:----|:----|`);
    }else{
        let result = data.match(fieldNameReg);
        if(result){
            console.log(`|${data.slice(2,-1)}| |`);
        }
    }
    next()
}
let sqlPath = path.join(__dirname,'init.sql');
readLine(fs.createReadStream(sqlPath), {
    // 换行符，默认\n
    newline: '\n',
    // 是否自动读取下一行，默认false
    autoNext: false,
    // 编码器，可以为函数或字符串（内置编码器：json，base64），默认null
    encoding: null
}).go(onDataIn, function () { })