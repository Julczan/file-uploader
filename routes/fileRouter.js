const { Router } = require("express");
const { isAuth } = require("./authMiddleware");
const { uploadFileFormGet } = require("../controllers/fileController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const fileRouter = Router();

fileRouter.get("/", isAuth, uploadFileFormGet);

module.exports = fileRouter;
