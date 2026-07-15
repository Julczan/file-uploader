const { Router } = require("express");
const { isAuth } = require("./authMiddleware");
const { createFolderPost } = require("../controllers/folderController");

const folderRouter = Router();

folderRouter.post("/create", isAuth, createFolderPost);

module.exports = folderRouter;
