
import {useState,useEffect,useCallback} from 'react';
import {message} from 'antd';
import {MAX_FILE_SIZE} from './constant';
function useDrag(uploadContainerRef){
    //定义一个状态用来保存用户选中的文件
    const [selectedFile,setSelectedFile] = useState(null);
    //存放文件的预览信息 url是预览地址 type是文件类型
    const [filePreview,setFilePreview] = useState({url:null,type:null});
    const handleDrag = useCallback((event)=>{
        event.preventDefault();//阻止默认行为
        event.stopPropagation();//阻止事件传播
    },[])
    const checkFile = (files)=>{
        debugger
        const file = files[0];
        if(!file){
            message.error('没有选择任何文件');
            return;
        }
        //判断文件大小不能超过2G
        if(file.size > MAX_FILE_SIZE){
            message.error('文件大小不能超过2G');
            return;
        }
        //再判断类型,限定只能上传图片和视频
        if(!(file.type.startsWith('image/') || file.type.startsWith('video/'))){
            message.error('文件类型必须是图片或视频');
            return;
        }
        setSelectedFile(file);
    }
    const handleDrop = useCallback((event)=>{
        event.preventDefault();//阻止默认行为
        event.stopPropagation();//阻止事件传播
        checkFile(event.dataTransfer.files);
    },[])//如果不给每二个参数则没有缓存的效果，每次都是新的
    useEffect(()=>{
        if(!selectedFile)return;
        const url = URL.createObjectURL(selectedFile);
        setFilePreview({url,type:selectedFile.type});
        //useEffect会返回一个销毁函数
        return ()=>{//revokeObjectURL可以撤销此URL占用的资源
            URL.revokeObjectURL(url);
        }
    },[selectedFile]);
    useEffect(()=>{
        const uploadContainer = uploadContainerRef.current;
        uploadContainer.addEventListener('dragenter',handleDrag);
        uploadContainer.addEventListener('dragover',handleDrag);
        uploadContainer.addEventListener('drop',handleDrop);
        uploadContainer.addEventListener('dragleave',handleDrag);
        return ()=>{
            uploadContainer.removeEventListener('dragenter',handleDrag);
            uploadContainer.removeEventListener('dragover',handleDrag);
            uploadContainer.removeEventListener('drop',handleDrop);
            uploadContainer.removeEventListener('dragleave',handleDrag);
        }
    },[]);
    //实现点击上传功能
    useEffect(()=>{
        const uploadContainer = uploadContainerRef.current;
        uploadContainer.addEventListener('click',()=>{
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change',(event)=>{
                checkFile(event.target.files);
            });
            document.body.appendChild(fileInput);
            //手工触发文件的选择
            fileInput.click();
        });
    },[]);
    const resetFileStatus =  ()=>{
        setSelectedFile(null);
        setFilePreview({url:null,type:null});
    }
    return {selectedFile,filePreview,resetFileStatus};
}
export default useDrag;