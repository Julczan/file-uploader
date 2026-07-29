const { getFileDetials } = require("../config/cloudinary");
const { getAllFilesDB } = require("../config/fileQueries");
const { getAllFoldersDB } = require("../config/folderQueries");
const { findUserById } = require("../config/queries");
const { getAllFilesWithoutFolder } = require("./fileController");

exports.indexPageGet = async (req, res, next) => {
  const folders = await getAllFoldersDB(req.user.id);
  const user = await findUserById(req.user.id);
  const files = await getAllFilesWithoutFolder(user);
  res.render("index", { folders: folders, files: files });
};
