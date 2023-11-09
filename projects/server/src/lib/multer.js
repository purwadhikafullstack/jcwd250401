const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, __dirname + "/../public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + file.mimetype.split("/")[1]);
  },
});

const fileFilter = (req, file, cb) => {
  const { mimetype } = file;
  switch (mimetype) {
    case "image/png":
    case "image/jpg":
    case "image/jpeg":
      cb(null, true);
      break;
    default:
      cb(new Error("File type is not supported"));
      break;
  }
};

exports.multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 1,
  },
});
