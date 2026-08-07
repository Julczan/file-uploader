const {
  createFolderDB,
  getAllUserFoldersDB,
  getItemsInFolderDB,
  updateFolderDB,
  deleteFolderDB,
  getParentFolder,
  getFolderAncestors,
  getFolderAndAllChildFoldersDB,
  getFolderTitleByIdDB,
  getFolderByTitle,
} = require("../config/folderQueries");

const { body, validationResult, matchedData } = require("express-validator");
const { getAllFilesWithoutFolder } = require("./fileController");
const { findUserById } = require("../config/queries");
const {
  createImageTagIcon,
  getAllAssetsInFolderCloud,
  createFolderCloud,
  deleteAssetsCloud,
  deleteFolderCloud,
  updateFolderCloud,
  getAssetsByPublicId,
  getImageIconPlaceholder,
} = require("../config/cloudinary");
const { deleteFilesDB } = require("../config/fileQueries");

const validateFolder = [
  body("folderTitle")
    .trim()
    .notEmpty()
    .withMessage("Folder Title can not be empty.")
    .isLength({ min: 1, max: 20 })
    .withMessage("Title must be between 1 and 20 characters")
    .custom(async (folderTitle, { req }) => {
      const userId = req.user.id;
      const folder = await getFolderByTitle(folderTitle, userId);
      if (folder) {
        throw new Error("Folder already exists!");
      }
    }),
];

exports.createFolderPost = [
  validateFolder,
  async (req, res, next) => {
    const errors = validationResult(req);
    const { openedFolderId } = req.params;
    const folders = await getAllUserFoldersDB();

    if (!errors.isEmpty() && openedFolderId) {
      const folderItems = await getItemsInFolderDB(Number(openedFolderId));
      return res.status(400).render("folders", {
        folders: folderItems.childFolders,
        openedFolderId: folderItems.id,
        errors: errors.array(),
      });
    }

    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        errors: errors.array(),
        folders: folders,
      });
    }

    const { folderTitle } = matchedData(req);
    const folderPath = `${req.user.username}/${folderTitle}`;
    await createFolderCloud(folderPath);
    await createFolderDB(folderTitle, req.user.id, Number(openedFolderId));

    if (openedFolderId) {
      res.redirect(`/folders/${openedFolderId}`);
    } else {
      res.redirect("/folders");
    }
  },
];

exports.updateFolderPost = [
  validateFolder,
  async (req, res, next) => {
    const errors = validationResult(req);
    const { openedFolderId, folderId } = req.params;
    const folders = await getAllUserFoldersDB();

    if (!errors.isEmpty() && openedFolderId) {
      const folderItems = await getItemsInFolderDB(Number(openedFolderId));
      return res.status(400).render("folders", {
        folders: folderItems.childFolders,
        openedFolderId: folderItems.id,
        errors: errors.array(),
      });
    }

    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        errors: errors.array(),
        folders: folders,
      });
    }

    const { folderTitle } = matchedData(req);
    const oldFolderTitle = await getFolderTitleByIdDB(Number(folderId));
    const oldPath = `${req.user.username}/${oldFolderTitle}`;
    const newPath = `${req.user.username}/${folderTitle}`;

    await updateFolderCloud(oldPath, newPath);
    await updateFolderDB(folderTitle, Number(folderId));

    if (openedFolderId) {
      res.redirect(`/folders/${openedFolderId}`);
    } else {
      res.redirect("/folders");
    }
  },
];

exports.deleteFolderPost = async (req, res, next) => {
  try {
    const { openedFolderId, folderId } = req.params;
    const userName = req.user.username;

    const folderWithChildFolders =
      await getFolderAndAllChildFoldersDB(folderId);

    for (const folder of folderWithChildFolders) {
      const folderPath = `${userName}/${folder.title}`;
      const assets = await getAllAssetsInFolderCloud(folderPath);

      if (assets && assets.length > 0) {
        await Promise.all(
          assets.map((asset) => deleteAssetsCloud(asset.public_id)),
        );
      }
    }

    for (const folder of folderWithChildFolders) {
      const folderPath = `${userName}/${folder.title}`;
      await deleteFolderCloud(folderPath);
    }

    for (const folder of folderWithChildFolders) {
      await deleteFilesDB(folder.id);
    }

    await deleteFolderDB(Number(folderId));

    if (openedFolderId) {
      res.redirect(`/folders/${openedFolderId}`);
    } else {
      res.redirect("/folders");
    }
  } catch (error) {
    next(error);
  }
};

exports.FolderListGet = async (req, res, next) => {
  const folders = await getAllUserFoldersDB(req.user.id);
  const user = await findUserById(req.user.id);
  const files = await getAllFilesWithoutFolder(user);

  res.render("folders", { folders: folders, files: files });
};

exports.getItemsInFolder = async (req, res, next) => {
  const { openedFolderId } = req.params;
  const folderItems = await getItemsInFolderDB(Number(openedFolderId));
  const folderTitle = await getFolderTitleByIdDB(Number(openedFolderId));

  const childFolders = await getFolderAndAllChildFoldersDB(openedFolderId);

  const folderItemsFiles = folderItems.files;

  for (const file of folderItemsFiles) {
    let imageTag = "";
    if (file.resourceType === "raw") {
      imageTag = getImageIconPlaceholder();
    }
    imageTag = createImageTagIcon(file.name, file.version, file.resourceType);
    file.imageTag = imageTag;
  }

  res.render("folders", {
    folders: folderItems.childFolders,
    openedFolderId: folderItems.id,
    files: folderItems.files,
  });
};
