const { Router } = require("express");
const { isAuth } = require("./authMiddleware");
const {
  createFolderPost,
  FolderListGet,
  getItemsInFolder,
} = require("../controllers/folderController");

const folderRouter = Router();

folderRouter.get("/", isAuth, FolderListGet);
folderRouter.get("/:folderId", getItemsInFolder);
folderRouter.post("/create/{:folderId}", isAuth, createFolderPost);

module.exports = folderRouter;
