const {
  createFolderDB,
  getAllFoldersDB,
  getItemsInFolderDB,
} = require("../config/folderQueries");

const { body, validationResult, matchedData } = require("express-validator");

const validateFolder = [
  body("folder")
    .trim()
    .notEmpty()
    .withMessage("Folder Title can not be empty.")
    .isLength({ min: 1, max: 20 })
    .withMessage("Title must be between 1 and 20 characters"),
];

exports.createFolderPost = [
  validateFolder,
  async (req, res, next) => {
    const errors = validationResult(req);
    const { folderId } = req.params;
    const folders = await getAllFoldersDB();

    if (!errors.isEmpty() && folderId) {
      const folderItems = await getItemsInFolderDB(Number(folderId));
      return res.status(400).render("folders", {
        folders: folderItems.childFolders,
        folderId: folderItems.id,
        errors: errors.array(),
      });
    }

    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        errors: errors.array(),
        folders: folders,
      });
    }

    const { folder } = matchedData(req);
    await createFolderDB(folder, req.user.id, Number(folderId));
    if (folderId) {
      res.redirect(`/folders/${folderId}`);
    }
    res.redirect("/folders");
  },
];

exports.FolderListGet = async (req, res, next) => {
  const folders = await getAllFoldersDB();
  res.render("folders", { folders: folders });
};

exports.getItemsInFolder = async (req, res, next) => {
  const { folderId } = req.params;
  const folderItems = await getItemsInFolderDB(Number(folderId));

  res.render("folders", {
    folders: folderItems.childFolders,
    folderId: folderItems.id,
  });
};
