const multerUploads = require("../config/multer");
const { dataUri } = require("../config/dataUri");
const {
  getFileDetialsCloud,
  createImageTagDetails,
  createImageTagIcon,
  uploadFileCloud,
  deleteAssetsCloud,
  createVideoTagDetails,
  getImageDetailsPlaceholder,
  getImageIconPlaceholder,
} = require("../config/cloudinary");
const {
  uploadFileDB,
  getFileDetailsDB,
  getFilesInFolderDB,
  deleteSingleFileDB,
  getFileByTitle,
} = require("../config/fileQueries");
const { findUserById } = require("../config/queries");
const {
  getFolderTitleByIdDB,
  getAllUserFoldersDB,
  getItemsInFolderDB,
} = require("../config/folderQueries");

const { body, validationResult, matchedData } = require("express-validator");

const validateFileName = [
  body("fileName")
    .trim()
    .notEmpty()
    .withMessage("File Name can not be empty.")
    .isLength({ min: 1, max: 20 })
    .withMessage("File Name must be between 1 and 20 characters")
    .custom(async (fileName, { req }) => {
      const userId = req.user.id;
      const userName = req.user.username;
      const { openedFolderId } = req.params;

      let filePublicId = "";
      filePublicId = userName + "/";

      if (openedFolderId) {
        const folderTitle = await getFolderTitleByIdDB(Number(openedFolderId));
        filePublicId += folderTitle + "/";
      }
      filePublicId += fileName;

      const file = await getFileByTitle(filePublicId, userId);

      if (file) {
        throw new Error("File with that name already exists!");
      }
    }),
];

exports.uploadFileFormGet = (req, res) => {
  res.render("uploadFileForm");
};

exports.getFileDetails = async (req, res, next) => {
  const { fileId } = req.params;
  const file = await getFileDetailsDB(Number(fileId));

  const fileCloud = await getFileDetialsCloud(file.name, file.resourceType);

  let imageTag = "";
  if (file.resourceType === "image") {
    imageTag = createImageTagDetails(file.name, file.version);
  }
  if (file.resourceType === "video") {
    imageTag = createVideoTagDetails(file.name, file.version);
  }
  if (file.resourceType === "raw") {
    imageTag = getImageDetailsPlaceholder();
  }

  res.render("fileDetails", {
    file: fileCloud,
    imageTag: imageTag,
    timeStamp: file.createdAt,
  });
};

exports.uploadFileFormPost = [
  multerUploads.single("file"),
  validateFileName,
  async (req, res, next) => {
    const errors = validationResult(req);

    const openedFolderId = Number(req.params.openedFolderId);
    const folders = await getAllUserFoldersDB();
    const user = await findUserById(req.user.id);
    const files = await this.getAllFilesWithoutFolder(user);

    if (!errors.isEmpty() && openedFolderId) {
      const folderItems = await getItemsInFolderDB(Number(openedFolderId));

      const folderItemsFiles = folderItems.files;
      for (const file of folderItemsFiles) {
        let imageTag = "";
        if (file.resourceType === "raw") {
          imageTag = getImageIconPlaceholder();
        }
        imageTag = createImageTagIcon(
          file.name,
          file.version,
          file.resourceType,
        );
        file.imageTag = imageTag;
      }
      return res.status(400).render("folders", {
        folders: folderItems.childFolders,
        files: folderItemsFiles,
        openedFolderId: folderItems.id,
        errors: errors.array(),
      });
    }

    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        errors: errors.array(),
        folders: folders,
        files: files,
      });
    }

    if (req.file) {
      const filePath = dataUri(req).content;
      let openedFolderTitle = "";
      if (openedFolderId) {
        openedFolderTitle = await getFolderTitleByIdDB(openedFolderId);
      }

      const { fileName } = matchedData(req);
      const userName = req.user.username;
      const result = await uploadFileCloud(
        filePath,
        fileName,
        userName,
        openedFolderTitle,
      );

      await uploadFileDB(
        req.user.id,
        openedFolderId,
        result.secure_url,
        result.public_id,
        result.version,
        result.resource_type,
      );
    }
    if (openedFolderId) {
      res.redirect(`/folders/${openedFolderId}`);
    } else {
      res.redirect("/folders");
    }
  },
];

exports.getAllFilesWithoutFolder = async (user) => {
  const files = await getFilesInFolderDB(user.id, null);
  for (const file of files) {
    let imageTag = "";
    if (file.resourceType === "raw") {
      imageTag = getImageIconPlaceholder();
    } else {
      imageTag = createImageTagIcon(file.name, file.version, file.resourceType);
    }
    file.imageTag = imageTag;
  }
  return files;
};

exports.deleteSingleFile = async (req, res, next) => {
  const openedFolderId = Number(req.params.openedFolderId);
  const fileId = Number(req.params.fileId);

  const fileDetails = await getFileDetailsDB(fileId);

  await deleteAssetsCloud(fileDetails.name, fileDetails.resourceType);

  await deleteSingleFileDB(fileId);

  if (openedFolderId) {
    res.redirect(`/folders/${openedFolderId}`);
  } else {
    res.redirect("/folders");
  }
};
