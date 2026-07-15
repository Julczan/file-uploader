const { getAllFoldersDB } = require("../config/folderQueries");

exports.indexPageGet = async (req, res, next) => {
  const folders = await getAllFoldersDB();
  res.render("index", { folders: folders });
};
