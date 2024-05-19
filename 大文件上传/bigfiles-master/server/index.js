const express = require('express');
const logger = require('morgan');
const { StatusCodes } = require('http-status-codes');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const TEMP_DIR = path.resolve(__dirname, 'temp');
const CHUNK_SIZE = 100 * 1024 * 1024;
//存放上传并合并好的文件
fs.ensureDirSync(PUBLIC_DIR);
//存放分片的文件
fs.ensureDirSync(TEMP_DIR);
const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));
/**
 * 上传分片
 */
app.post('/upload/:filename', async (req, res, next) => {
    //通过路径参数获取文件名
    const { filename } = req.params;
    //通过查询参数获取分片名
    const { chunkFileName } = req.query;
    //写入文件的起始位置
    const start = isNaN(req.query.start)?0:parseInt(req.query.start,10);
    //创建用户保存此文件的分片的目录
    const chunkDir = path.resolve(TEMP_DIR, filename);
    //分片的文件路径
    const chunkFilePath = path.resolve(chunkDir, chunkFileName);
    //先确定分片目录存在
    await fs.ensureDir(chunkDir);
    //创建此文件的可写流 ,可以指定写入的起始位置
    const ws = fs.createWriteStream(chunkFilePath, {start,flags:'a'});
    //后面会实现暂停操作，如果客户端点击了暂停按钮，会取消上传的操作，取消之后会在服务器触发请求择象的
    //aborted事件，关闭可定流
    req.on('aborted', () => { ws.close() });
    //使用管道的方式把请求中的请求体流数据写入到文件中
    try {
        await pipeStream(req, ws);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

app.get('/merge/:filename', async (req, res, next) => {
    //通过路径参数获取文件名
    const { filename } = req.params;
    try {
        await mergeChunks(filename);
        res.json({ success: true });
    } catch (error) {
        next(error)
    }
});
app.get('/verify/:filename',async (req,res,next)=>{
    const {filename} = req.params;
    //先获取文件在服务器的路径
    const filePath = path.resolve(PUBLIC_DIR,filename);
    //判断是文件在服务器端是否存在
    const isExist = await fs.pathExists(filePath);
    //如果已经存在了，则直接返回不需要上传了
    if(isExist){
        return res.json({success:true,needUpload:false});
    }
    const chunksDir = path.resolve(TEMP_DIR,filename);
    const existDir = await fs.pathExists(chunksDir);
    //存放已经上传的分片的对象数组
    let uploadedChunkList =[];
    if(existDir){
        //读取临时目录里面的所有的分片对应的文件
        const chunkFileNames = await fs.readdir(chunksDir);
        //读取每个分片文件的文件信息，主要是它的文件大小，表示已经上传的文件的大小
        uploadedChunkList = await Promise.all(chunkFileNames.map(async function(chunkFileName){
            const {size} = await fs.stat(path.resolve(chunksDir,chunkFileName));
            return {chunkFileName,size};
        }));
    }
    //如果没有此文件，则意味着服务器还需要你上传此文件
    //返回，上传尚未完成，但是已经上传了一部分了，我把已经上传的分片名，以及分片的大小给客户端
    //客户端可以只上传分片剩下的数据部就可以了
    res.json({success:true,needUpload:true,uploadedChunkList});
});
async function mergeChunks(filename) {
    const mergedFilePath = path.resolve(PUBLIC_DIR, filename);
    const chunkDir = path.resolve(TEMP_DIR, filename);
    const chunkFiles = await fs.readdir(chunkDir);
    //对分片按索引进行升序排列
    chunkFiles.sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]));
    try {
        //为了提高性能，我们在这时可以分片并行写入
        const pipes = chunkFiles.map((chunkFile, index) => {
            return pipeStream(
                fs.createReadStream(path.resolve(chunkDir, chunkFile), { autoClose: true }),
                fs.createWriteStream(mergedFilePath, { start: index * CHUNK_SIZE })
            );
        });
        //并发把每个分片的数据写入到目标文件中
        await Promise.all(pipes);
        //删除分片的文件和文件夹
        await fs.rmdir(chunkDir, { recursive: true })
        //合并完文件之后可以重新在这里计算合并后的文件的hash值，和文件中的hash值进行对比
        //如果值是一样的，说明肯定内容是对的，没有被修改
    } catch (error) {
        next(error)
    }
}
function pipeStream(rs, ws) {
    return new Promise((resolve, reject) => {
        //把可读流中的数据写入可写流中
        rs.pipe(ws).on('finish', resolve).on('error', reject);
    });
}
app.listen(8080, () => console.log('Sever started on port 8080'));