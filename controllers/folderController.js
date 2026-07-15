const { createFolderDB } = require("../config/folderQueries");

exports.createFolderPost = async (req, res, next) => {
  await createFolderDB(req.body.folder, req.user.id);
  res.redirect("/");
};
