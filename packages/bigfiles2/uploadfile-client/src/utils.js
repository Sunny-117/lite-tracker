import { CHUNK_SIZE } from "./constant";
import axios from "axios";
import axiosInstance from "./axiosInstance";
import { message } from "antd";

// 获取文件的hash name
export const getFileName = async (file) => {
  const fileHash = await calculateHash(file);
  const fileExtension = file.name.split(".").pop();
  return `${fileHash}.${fileExtension}`;
};

async function calculateHash(file) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  return bufferToHex(hashBuffer);
}

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// 上传
export async function uploadFile(
  file,
  filename,
  setUploadProgress,
  resetAllStatus,
  setCancelTokens
) {
  const { needUpload, uploadedChunkList } = await axiosInstance.get(
    `/verify/${filename}`
  );
  if (!needUpload) {
    message.success("文件已存在，秒传成功");
    return resetAllStatus();
  }
  //把在文件进行切片
  const chunks = createFileChunks(file, filename);
  const newCancelTokens = [];
  //实现并行上传
  const requests = chunks.map(({ chunk, chunkFileName }, index) => {
    const cancelToken = axios.CancelToken.source();
    newCancelTokens.push(cancelToken);
    // 不是完整的chunk数据了
    const existingChunk = uploadedChunkList.find((uploadedChunk, size) => {
      return uploadedChunk.chunkFileName === chunkFileName;
    });
    //如果存在existingChunk，说明此分片已经上传过一部分了，或者说已经完全 上传完成
    if (existingChunk) {
      // 说明此分片上传过一部分了 或者全部传了
      const uploadedSize = existingChunk.size;
      const remainingChunk = chunk.slice(uploadedSize);
      if (remainingChunk.size === 0) {
        //如果剩下的数据为0，说明完全 上传完毕
        if (remainingChunk.size === 0) {
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            [chunkFileName]: 100,
          }));
          return Promise.resolve();
        }
      }
      // 100个字节，第一次上传的时候60个字节，暂停了
      //下次再传的是传剩下的40字节，从哪个位置开始写，要从上次结束的位置 ，也就是60开始写
      //如果剩下的数据还有，则需要继续上传剩余的部分 总计100字节，已经传60字节，继续传剩下的40个字节，写入文件的起始索引60
      setUploadProgress((prevProgress) => ({
        ...prevProgress,
        [chunkFileName]: (uploadedSize * 100) / chunk.size,
      }));
      return createRequest(
        filename,
        chunkFileName,
        remainingChunk,
        setUploadProgress,
        cancelToken,
        uploadedSize
      );
    } else {
      return createRequest(
        filename,
        chunkFileName,
        chunk,
        setUploadProgress,
        cancelToken,
        0,
        chunk.size
      );
    }
  });
  setCancelTokens(newCancelTokens);
  try {
    await Promise.all(requests);
    await axiosInstance.get(`/merge/${filename}`);
    message.success("上传完成");
    resetAllStatus();
  } catch (error) {
    //如果是由于用户主动点击了暂停的按钮，暂停了上传
    if (axios.isCancel(error)) {
      console.log("上传暂停");
      message.error("上传暂停");
    } else {
      console.error("上传出错:", error);
      message.error("上传出错");
    }
  }
}

function createRequest(
  filename,
  chunkFileName,
  chunk,
  setUploadProgress,
  cancelToken,
  start
) {
  return axiosInstance.post(`/upload/${filename}`, chunk, {
    headers: {
      "Content-Type": "application/octet-stream",
    },
    params: {
      chunkFileName,
      start,
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setUploadProgress((prevProgress) => ({
        ...prevProgress,
        [chunkFileName]: percentCompleted,
      }));
    },
    cancelToken: cancelToken.token,
  });
}

function createFileChunks(file, filename) {
  let chunks = [];
  window.file = file;
  let count = Math.ceil(file.size / CHUNK_SIZE);
  for (let i = 0; i < count; i++) {
    let chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    chunks.push({
      chunk,
      chunkFileName: `${filename}-${i}`,
    });
  }
  return chunks;
}
