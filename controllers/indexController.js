const { getFileDetials } = require("../config/cloudinary");
const { getAllFilesDB } = require("../config/fileQueries");
const { getAllFoldersDB } = require("../config/folderQueries");

exports.indexPageGet = async (req, res, next) => {
  const folders = await getAllFoldersDB(req.user.id);
  const files = await getAllFilesDB(req.user.id);

  res.render("index", { folders: folders, files: files });
};
