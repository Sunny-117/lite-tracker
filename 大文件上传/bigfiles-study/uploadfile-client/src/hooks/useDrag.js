import { useCallback, useEffect, useState } from "react";
import { MAX_FILE_SIZE } from "../constant";
import { message } from "antd";

const useDrag = (uploadContainerRef) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState({
    url: null,
    type: null,
  });

  useEffect(() => {
    if (!selectedFile) return;
    const url = URL.createObjectURL(selectedFile);
    setFilePreview({ url, type: selectedFile.type });
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const handleDrag = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const checkFile = (files) => {
    const file = files[0];
    if (!file) {
      message.error("没有选择任何文件");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      message.error("文件大小不能超过20GB");
      return;
    }
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      message.error("文件类型必须是图片或视频");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    checkFile(event.dataTransfer.files);
  };

  useEffect(() => {
    const uploadContainer = uploadContainerRef.current;
    uploadContainer.addEventListener("dragenter", handleDrag);
    uploadContainer.addEventListener("dragover", handleDrag);
    uploadContainer.addEventListener("drop", handleDrop);
    uploadContainer.addEventListener("dragleave", handleDrag);
    return () => {
      uploadContainer.removeEventListener("dragenter", handleDrag);
      uploadContainer.removeEventListener("dragover", handleDrag);
      uploadContainer.removeEventListener("drop", handleDrop);
      uploadContainer.removeEventListener("dragleave", handleDrag);
    };
  }, []);

  const resetFileStatus = () => {
    setSelectedFile(null);
    setFilePreview({
      url: null,
      type: null,
    });
  };
  return { selectedFile, filePreview, resetFileStatus };
};

export default useDrag;
