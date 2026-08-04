const { getFileDetials } = require("../config/cloudinary");
const { getAllFilesDB } = require("../config/fileQueries");
const { getAllUserFoldersDB } = require("../config/folderQueries");
const { findUserById } = require("../config/queries");
const { getAllFilesWithoutFolder } = require("./fileController");

exports.indexPageGet = async (req, res, next) => {
  const folders = await getAllUserFoldersDB(req.user.id);
  const user = await findUserById(req.user.id);
  const files = await getAllFilesWithoutFolder(user);
  res.render("index", { folders: folders, files: files });
};
