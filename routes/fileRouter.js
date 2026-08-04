const { Router } = require("express");
const { isAuth, isFileAuthor } = require("./authMiddleware");
const {
  uploadFileFormGet,
  uploadFileFormPost,
  getFileDetails,
  getAllFilesWithoutFolder,
  deleteSingleFile,
} = require("../controllers/fileController");
const multerUploads = require("../config/multer");
const { dataUri } = require("../config/dataUri");
const { uploadImage } = require("../config/cloudinary");

const fileRouter = Router();

fileRouter.get("/", getAllFilesWithoutFolder);

fileRouter.get("/upload", isAuth, uploadFileFormGet);

fileRouter.post("/upload/{:openedFolderId}", uploadFileFormPost);

fileRouter.get("/:fileId", isFileAuthor, getFileDetails);

fileRouter.post("/:fileId/delete/{:openedFolderId}", deleteSingleFile);

module.exports = fileRouter;
