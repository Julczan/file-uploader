const multer = require("multer");
const storage = multer.memoryStorage();

const multerUploads = multer({ storage, limits: { fileSize: 10485760 } });

module.exports = multerUploads;
