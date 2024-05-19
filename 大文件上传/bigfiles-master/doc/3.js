//1.先调用你的后台接口，它会给你返一个临时的带签名的URL地址

async function uploadFileToOSS(file,signUrl){
   const response =  await fetch(signUrl,{
        method:'PUT',
        body:file,
        headers:{
            'Content-Type':file.type
        }
    });
    if(response.ok){
        console.log('上传成功');
    }
}