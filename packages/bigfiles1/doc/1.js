async function uploadFileInChunks(file, chunkSize, maxConcurrentUploads) {
    let chunks = createChunks(file, chunkSize);
    let activeUploads = [];
    let completedUploads = 0;
    async function uploadNextChunk() {
      if (chunks.length === 0 && activeUploads.length === 0) {
        if (completedUploads === 10) {
          console.log("上传完成");
        }
        return;
      }
      while (activeUploads.length < maxConcurrentUploads && chunks.length > 0) {
        let chunk = chunks.shift();
        let uploadPromise = uploadChunk(chunk).then(() => {
          completedUploads++;
        }).catch(error => {
          console.error("上传失败:", error);
        }).finally(() => {
          activeUploads.splice(activeUploads.indexOf(uploadPromise), 1);
          uploadNextChunk();
        });
        activeUploads.push(uploadPromise);
      }
    }
    await uploadNextChunk();
  }
  function createChunks(file, size) {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }
  function uploadChunk(chunk) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`上传第${chunk}块`);
        resolve();
      }, 1000);
    });
  }
  let file;
  uploadFileInChunks(file, 1024 * 1024, 5);