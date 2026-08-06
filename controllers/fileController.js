const multer = require("multer");
const multerUploads = require("../config/multer");
const { dataUri } = require("../config/dataUri");
const {
  getFileDetialsCloud,
  createImageTagDetails,
  createImageTagIcon,
  uploadFileCloud,
  deleteAssetsCloud,
  createVideoTagDetails,
} = require("../config/cloudinary");
const {
  uploadFileDB,
  getFileDetailsDB,
  getFilesInFolderDB,
  deleteSingleFileDB,
} = require("../config/fileQueries");
const { findUserById } = require("../config/queries");
const { getFolderTitleByIdDB } = require("../config/folderQueries");

exports.uploadFileFormGet = (req, res) => {
  res.render("uploadFileForm");
};

exports.getFileDetails = async (req, res, next) => {
  const { fileId } = req.params;
  const file = await getFileDetailsDB(Number(fileId));

  const fileCloud = await getFileDetialsCloud(file.name, file.resourceType);

  console.log(fileCloud);

  let imageTag = "";
  if (file.resourceType === "image") {
    imageTag = createImageTagDetails(file.name, file.version);
  }
  if (file.resourceType === "video") {
    imageTag = createVideoTagDetails(file.name, file.version);
  }

  res.render("fileDetails", {
    file: fileCloud,
    imageTag: imageTag,
    timeStamp: file.createdAt,
  });
};

exports.uploadFileFormPost = [
  multerUploads.single("file"),
  async (req, res) => {
    const openedFolderId = Number(req.params.openedFolderId);
    if (req.file) {
      const filePath = dataUri(req).content;
      let openedFolderTitle = "";
      if (openedFolderId) {
        openedFolderTitle = await getFolderTitleByIdDB(openedFolderId);
      }

      const fileName = req.body.fileName;
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
    const imageTag = createImageTagIcon(file.name, file.version);
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
