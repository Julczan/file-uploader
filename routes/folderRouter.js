const { Router } = require("express");
const { isAuth } = require("./authMiddleware");
const {
  createFolderPost,
  FolderListGet,
  getItemsInFolder,
  updateFolderPost,
  deleteFolderPost,
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
folderRouter.post(
  "/:folderId/delete/{:openedFolderId}",
  isAuth,
  deleteFolderPost,
);

module.exports = folderRouter;
