self.addEventListener('message', async (event) => {
    //获取主进程发过来的文件
    const file = event.data;
    //单独开一个进程来进行hash计算并得到新的文件名
    const fileName = await getFileName(file);
    //把文件名再发回主进程 
    self.postMessage(fileName);
    /**
 * 根据文件对象获取根据文件内容得到的hash文件名
 * @param {*} file 文件对象
 */
    async function getFileName(file) {
        //计算此文件的hash值
        const fileHash = await calculateFileHash(file);
        //获取文件扩展名
        const fileExtension = file.name.split('.').pop();
        return `${fileHash}.${fileExtension}`;
    }
    /**
     * 计算文件的hash字符串
     * @param {*} file 
     * @returns 
     */
    async function calculateFileHash(file) {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        return bufferToHex(hashBuffer);
    }
    /**
     * 把ArrayBuffer转成16进制的字符串
     * @param {*} buffer 
     * @returns 
     */
    function bufferToHex(buffer) {
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
});