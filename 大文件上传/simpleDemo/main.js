import { createChunk } from "./createChunk.js";

let THREAD_COUNT = 2; // navigator.hardwareConcurrency || 4; // 开启4个线程
const CHUNK_SIZE = 20 * 1024 * 1024; // 500M

const showImg = document.getElementById("showImg");
const showVideo = document.getElementById("showVideo");
function render(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  if (file.type.includes("video")) {
    showVideo.setAttribute("src", url);
    showVideo.style.display = "block";
  } else {
    showImg.setAttribute("src", url);
  }
  // 切割文件
  cutFile(file);
}

async function cutFile(file) {
  // 文件切割
  const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
  console.log(chunkCount); // 20
  console.log("start...");

  console.time("111");
  const result1 = await chunkFileNotWork(file, chunkCount);
  console.log(result1, "result1...");
  console.timeEnd("111");

  console.time("222");
  const result2 = await chunkFileWithWork(file, chunkCount);
  console.log(result2, "result2");
  console.timeEnd("222");

  console.log("end...");
}

async function chunkFileNotWork(file, chunkCount) {
  // 太耗性能 启用 web worker 多线程
  let result = [];
  for (let i = 0; i < chunkCount; i++) {
    result.push(createChunk(file, i, CHUNK_SIZE));
  }
  return Promise.all(result);
}

async function chunkFileWithWork(file, chunkCount) {
  return new Promise((resolve) => {
    const workerChunkCount = Math.ceil(chunkCount / THREAD_COUNT);
    console.log(chunkCount, THREAD_COUNT, workerChunkCount);
    let result = [];
    let finishCount = 0;
    // 多个线程一起跑
    console.log(THREAD_COUNT, "启用线程数量");
    for (let i = 0; i < THREAD_COUNT; i++) {
      // 创建一个新的 Worker 线程
      const worker = new Worker("worker.js", {
        type: "module",
      });
      // 计算每个线程的开始索引和结束索引
      const startIndex = i * workerChunkCount;
      let endIndex = startIndex + workerChunkCount;
      if (endIndex > chunkCount) {
        endIndex = chunkCount;
      }

      console.log(startIndex, endIndex, "切分位置");
      if (startIndex <= chunkCount) {
        // 发送去计算
        worker.postMessage({
          file,
          CHUNK_SIZE,
          startIndex,
          endIndex,
        });
        finishCount++;
        // 接收计算结果
        worker.onmessage = (e) => {
          for (let i = startIndex; i < endIndex; i++) {
            result[i] = e.data[i - startIndex];
          }
          worker.terminate();
          finishCount--;
          if (finishCount === 0) {
            resolve(result);
          }
        };
      }
    }
  });
}

document.querySelector("input").onchange = function (event) {
  render(event);
};
