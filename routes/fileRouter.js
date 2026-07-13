const { Router } = require("express");
const { isAuth } = require("./authMiddleware");
const {
  uploadFileFormGet,
  uploadFileFormPost,
} = require("../controllers/fileController");

const fileRouter = Router();

fileRouter.get("/", isAuth, uploadFileFormGet);

fileRouter.post("/", uploadFileFormPost);

module.exports = fileRouter;
