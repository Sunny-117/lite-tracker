import axios from 'axios';
const axiosInstance = axios.create({
    baseURL:'http://localhost:8080'
});
axiosInstance.interceptors.response.use(
    (response)=>{
        //response响应对象 data,headers
        //response.data.success为true表示成功，为false表示失败了
        if(response.data && response.data.success){
            return response.data;//返回响应体，这样的话可以在代码直接获取响应体
        }else{
            throw new Error(response.data.message || '服务器端错误');
        }
    },
    (error)=>{
        console.error('错误',error)
        throw error;
    }
);
export default axiosInstance;