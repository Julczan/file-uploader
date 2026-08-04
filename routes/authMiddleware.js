const {
  getFolderAuthor,
  getAllUserFoldersDB,
} = require("../config/folderQueries");
const { getAllFilesWithoutFolder } = require("../controllers/fileController");

exports.isAuth = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("loginForm", {
      messages: ["You are not authenticated. Please log in."],
    });
  }
};

exports.isFolderAuthor = async (req, res, next) => {
  const userId = req.user.id;
  const { openedFolderId } = req.params;

  const folders = await getAllUserFoldersDB(userId);
  const files = await getAllFilesWithoutFolder(req.user);

  const folderAuthor = await getFolderAuthor(Number(openedFolderId));

  if (userId !== folderAuthor) {
    res.render("index", {
      folders: folders,
      files: files,
      errors: [{ msg: "You are not authorized to see the folder" }],
    });
    return;
  }

  next();
};
