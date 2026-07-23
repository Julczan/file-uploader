const { Router } = require("express");
const { isAuth } = require("./authMiddleware");
const {
  uploadFileFormGet,
  uploadFileFormPost,
  fileDetailsGet,
} = require("../controllers/fileController");

const fileRouter = Router();

fileRouter.get("/upload", isAuth, uploadFileFormGet);

fileRouter.post("/upload", uploadFileFormPost);

fileRouter.get("/:fileId", fileDetailsGet);

module.exports = fileRouter;
