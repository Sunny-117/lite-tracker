const express = require("express");
const multer = require("multer");

const app = express();
const upload = multer({
  dest: "uploads/", // 上传文件保存的目录
  limits: {
    fileSize: 1 * 1024 * 1024, // 文件大小限制为1M
  },
  fileFilter: (req, file, cb) => {
    // 检查文件后缀名是否符合要求
    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".bmp",
      ".webp",
      ".gif",
      ".png",
    ];
    const ext = file.originalname
      .toLowerCase()
      .slice(file.originalname.lastIndexOf("."));
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("后缀名不符合要求"));
    }
  },
});

// 处理单个文件上传的请求
app.post("/upload/single", upload.single("avatar"), (req, res) => {
  // 文件上传成功
  if (req.file) {
    const fileUrl = `http://localhost:3000/${req.file.filename}.${
      req.file.mimetype.split("/")[1]
    }`;
    console.log(req.file);
    res.json({ data: fileUrl });
  } else {
    // 文件上传失败
    let errCode;
    let errMsg;
    if (req.fileValidationError) {
      // 后缀名不符合要求
      errCode = 1;
      errMsg = "后缀名不符合要求";
    } else {
      // 文件过大
      errCode = 2;
      errMsg = "文件过大";
    }
    res.status(400).json({ errCode, errMsg });
  }
});

// 启动服务器
app.listen(3000, () => {
  console.log("服务器已启动，监听端口 3000");
});
