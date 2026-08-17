const { getFileAuthor } = require("../config/fileQueries");
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
  const user = req.user;
  const { openedFolderId } = req.params;

  if (!user) {
    return res.render("loginForm", {
      messages: ["You are not authenticated. Please log in."],
    });
  }

  const folders = await getAllUserFoldersDB(user.id);
  const files = await getAllFilesWithoutFolder(user);

  const { folderId } = req.params;

  let folderAuthor = "";
  if (openedFolderId) {
    folderAuthor = await getFolderAuthor(Number(openedFolderId));
  } else {
    folderAuthor = await getFolderAuthor(Number(folderId));
  }

  if (user.id !== folderAuthor) {
    res.render("index", {
      folders: folders,
      files: files,
      errors: [{ msg: "You are not authorized to see the folder" }],
    });
    return;
  }

  next();
};

exports.isFileAuthor = async (req, res, next) => {
  const user = req.user;
  const { fileId } = req.params;

  if (!user) {
    return res.render("loginForm", {
      messages: ["You are not authenticated. Please log in."],
    });
  }

  const folders = await getAllUserFoldersDB(user.id);
  const files = await getAllFilesWithoutFolder(user);

  const fileAuthor = await getFileAuthor(Number(fileId));

  if (user.id !== fileAuthor) {
    res.render("index", {
      folders: folders,
      files: files,
      errors: [{ msg: "You are not authorized to see this file" }],
    });
    return;
  }

  next();
};
