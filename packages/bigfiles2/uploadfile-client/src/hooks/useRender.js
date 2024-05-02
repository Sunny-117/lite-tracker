import { Button, Progress } from "antd";
import { UploadStatus } from "../constant";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";

const useRender = () => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState(UploadStatus.NOT_STARTED);
  const [cancelTokens, setCancelTokens] = useState([]);

  const _pauseUpload = (cancelTokens, setUploadStatus) => {
    setUploadStatus(UploadStatus.PAUSED);
    cancelTokens.forEach((cancelToken) => cancelToken.cancel("用户取消上传"));
  };

  const renderButton = (handleUpload) => {
    switch (uploadStatus) {
      case UploadStatus.NOT_STARTED:
        return <Button onClick={handleUpload}>上传</Button>;
      case UploadStatus.UPLOADING:
        return (
          <Button onClick={() => _pauseUpload(cancelTokens, setUploadStatus)}>
            暂停
          </Button>
        );
      case UploadStatus.PAUSED:
        return <Button onClick={handleUpload}>恢复上传</Button>;
      default:
        return null;
    }
  };

  const renderProgress = () => {
    if (uploadStatus !== UploadStatus.NOT_STARTED) {
      return Object.keys(uploadProgress).map((chunkName, index) => (
        <div key={chunkName}>
          <span>切片{index}:</span>
          <Progress percent={uploadProgress[chunkName]} />
        </div>
      ));
    }
  };

  function renderFilePreview(filePreview) {
    if (filePreview?.url) {
      if (filePreview.type.startsWith("video/")) {
        return <video src={filePreview.url} alt="Preview" controls />;
      } else if (filePreview.type.startsWith("image/")) {
        return <img src={filePreview.url} alt="Preview" />;
      } else {
        return filePreview.url;
      }
    } else {
      return <InboxOutlined />;
    }
  }

  return {
    renderButton,
    renderProgress,
    renderFilePreview,
    setUploadProgress,
    setUploadStatus,
    setCancelTokens,
  };
};

export default useRender;
