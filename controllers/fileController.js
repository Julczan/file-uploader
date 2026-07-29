const multer = require("multer");
const multerUploads = require("../config/multer");
const { dataUri } = require("../config/dataUri");
const {
  getFileDetialsCloud,
  createImageTagDetails,
  createImageTagIcon,
  uploadFileCloud,
} = require("../config/cloudinary");
const {
  uploadFileDB,
  getFileDetailsDB,
  getFilesInFolderDB,
} = require("../config/fileQueries");
const { findUserById } = require("../config/queries");
const { getFolderTitleByIdDB } = require("../config/folderQueries");

exports.uploadFileFormGet = (req, res) => {
  res.render("uploadFileForm");
};

exports.getFileDetails = async (req, res, next) => {
  const { fileId } = req.params;
  const user = await findUserById(req.user.id);
  const file = await getFileDetailsDB(Number(fileId));
  const folderId = file.folderId;

  let folderTitle = "";

  if (folderId) {
    folderTitle = await getFolderTitleByIdDB(folderId);
  }

  const fileCloud = await getFileDetialsCloud(
    `${user.username}/${folderTitle}/${file.name}`,
  );

  const imageTag = createImageTagDetails(
    `${user.username}/${folderTitle}/${file.name}`,
  );

  res.render("fileDetails", { file: fileCloud, imageTag: imageTag });
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

      console.log(result);

      await uploadFileDB(
        req.user.id,
        openedFolderId,
        result.secure_url,
        result.display_name,
      );
    }
    if (openedFolderId) {
      res.redirect(`/folders/${openedFolderId}`);
    }
    res.redirect("/folders");
  },
];

exports.getAllFilesWithoutFolder = async (user) => {
  const files = await getFilesInFolderDB(user.id, null);
  files.forEach((file) => {
    const imageTag = createImageTagIcon(`${user.username}/${file.name}`);
    file.imageTag = imageTag;
  });
  return files;
};
