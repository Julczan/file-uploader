const { Router } = require("express");
const { isAuth } = require("./authMiddleware");
const {
  createFolderPost,
  FolderListGet,
  getItemsInFolder,
  updateFolderPost,
} = require("../controllers/folderController");

const folderRouter = Router();

folderRouter.get("/", isAuth, FolderListGet);
folderRouter.get("/:openedFolderId", getItemsInFolder);
folderRouter.post("/create/{:openedFolderId}", isAuth, createFolderPost);
folderRouter.post(
  "/:folderId/update/{:openedFolderId}",
  isAuth,
  updateFolderPost,
);

module.exports = folderRouter;
