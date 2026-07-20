const {
  createFolderDB,
  getAllFoldersDB,
  getItemsInFolderDB,
} = require("../config/folderQueries");

exports.createFolderPost = async (req, res, next) => {
  await createFolderDB(req.body.folder, req.user.id);
  res.redirect("/");
};

exports.FolderListGet = async (req, res, next) => {
  const folders = await getAllFoldersDB();
  res.render("folders", { folders: folders });
};

exports.getItemsInFolder = async (req, res, next) => {
  const { folderId } = req.params;
  const folderItems = await getItemsInFolderDB(Number(folderId));
  console.log(folderItems);
  res.render("folders", { folders: folderItems.childFolders });
};
