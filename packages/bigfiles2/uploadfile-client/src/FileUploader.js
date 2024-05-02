import "./FileUploader.css";
import useDrag from "./hooks/useDrag";
import useRender from "./hooks/useRender";

import { useRef } from "react";
import { message } from "antd";
import { getFileName, uploadFile } from "./utils";
import { UploadStatus } from "./constant";

const FileUploader = () => {
  const uploadContainerRef = useRef(null);
  const { selectedFile, filePreview, resetFileStatus } =
    useDrag(uploadContainerRef);

  const {
    renderButton,
    renderProgress,
    renderFilePreview,
    setUploadProgress,
    setUploadStatus,
    setCancelTokens,
  } = useRender();

  const resetAllStatus = () => {
    resetFileStatus();
    setUploadProgress({});
    setUploadStatus(UploadStatus.NOT_STARTED);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      message.error("请先选择一个文件");
      return;
    }
    setUploadStatus(UploadStatus.UPLOADING);
    const filename = await getFileName(selectedFile);
    await uploadFile(
      selectedFile,
      filename,
      setUploadProgress,
      resetAllStatus,
      setCancelTokens
    );
  };

  return (
    <>
      <div className="upload-container" ref={uploadContainerRef}>
        {renderFilePreview(filePreview)}
      </div>
      {/* {isCalculatingFileName&&<Spin tip={<span>正在计算文件名...</span>}><span>正在计算文件名...</span></Spin>} */}
      {renderButton(handleUpload)}
      {renderProgress()}
    </>
  );
};
export default FileUploader;
