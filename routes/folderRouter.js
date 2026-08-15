const { Router } = require("express");
const { isAuth, isFolderAuthor } = require("./authMiddleware");
const {
  createFolderPost,
  FolderListGet,
  getItemsInFolder,
  updateFolderPost,
  deleteFolderPost,
} = require("../controllers/folderController");
const { signToken, authenticateToken } = require("../config/passport-jwt");
const passport = require("passport");

const folderRouter = Router();

folderRouter.get("/", isAuth, FolderListGet);
folderRouter.get("/:openedFolderId", isFolderAuthor, getItemsInFolder);
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
