const { Router } = require("express");
const { isAuth } = require("./authMiddleware");
const {
  uploadFileFormGet,
  fileDetailsGet,
  uploadFileFormPost,
} = require("../controllers/fileController");
const multerUploads = require("../config/multer");
const { dataUri } = require("../config/dataUri");
const { uploadImage } = require("../config/cloudinary");

const fileRouter = Router();

fileRouter.get("/upload", isAuth, uploadFileFormGet);

fileRouter.post("/upload/{:openedFolderId}", uploadFileFormPost);

fileRouter.get("/:fileId", fileDetailsGet);

module.exports = fileRouter;
