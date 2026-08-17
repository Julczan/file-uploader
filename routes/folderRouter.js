const { Router } = require("express");
const { isAuth, isFolderAuthor } = require("./authMiddleware");
const {
  createFolderPost,
  FolderListGet,
  getItemsInFolder,
  updateFolderPost,
  deleteFolderPost,
  generateFolderLink,
} = require("../controllers/folderController");
const { authenticateToken } = require("../config/passport-jwt");
const passport = require("passport");

const folderRouter = Router();

folderRouter.get("/", isAuth, FolderListGet);
folderRouter.get("/:openedFolderId", isFolderAuthor, getItemsInFolder);
folderRouter.post("/create/{:openedFolderId}", isAuth, createFolderPost);
folderRouter.post(
  "/:folderId/update/{:openedFolderId}",
  isAuth,
  isFolderAuthor,
  updateFolderPost,
);
folderRouter.post(
  "/:folderId/delete/{:openedFolderId}",
  isAuth,
  isFolderAuthor,
  deleteFolderPost,
);

folderRouter.post(
  "/:folderId/share",
  isAuth,
  isFolderAuthor,
  generateFolderLink,
);

module.exports = folderRouter;
