self.onmessage = async (e) => {
  const proms = [];
  const { file, CHUNK_SIZE, startIndex, endIndex } = e.data;
  console.log("开始任务", startIndex, endIndex);
  for (let i = startIndex; i < endIndex; i++) {
    proms.push(createChunk(file, i, CHUNK_SIZE));
  }
  try {
    const chunks = await Promise.all(proms);
    console.log(chunks, "chunks");
    self.postMessage(chunks);
  } catch (error) {
    console.log(error, "error");
  }
};

function createChunk(file, index, chunkSize) {
  return new Promise((resolve) => {
    const start = index * chunkSize;
    const end = start + chunkSize;
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      resolve({
        start,
        end,
        index,
        hash: await calculateHash(e.target.result),
      });
    };
    fileReader.readAsArrayBuffer(file.slice(index, end));
  });
}

async function calculateHash(content) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", content);
  return bufferToHex(hashBuffer);
}

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
