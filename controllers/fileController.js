const multer = require("multer");
const multerUploads = require("../config/multer");
const { dataUri } = require("../config/dataUri");
const {
  uploadFile,
  getFileDetialsCloud,
  createImageTagDetails,
  createImageTagIcon,
} = require("../config/cloudinary");
const {
  uploadFileDB,
  getAllFilesDB,
  getFileDetailsDB,
} = require("../config/fileQueries");
const { findUserById } = require("../config/queries");
const upload = multer({ dest: "uploads/" });

exports.uploadFileFormGet = (req, res) => {
  res.render("uploadFileForm");
};

exports.getFileDetails = async (req, res, next) => {
  const { fileId } = req.params;
  const user = await findUserById(req.user.id);
  const file = await getFileDetailsDB(Number(fileId));
  const fileCloud = await getFileDetialsCloud(`${user.username}/${file.name}`);

  const imageTag = createImageTagDetails(`${user.username}/${file.name}`);

  res.render("fileDetails", { file: fileCloud, imageTag: imageTag });
};

exports.uploadFileFormPost = [
  multerUploads.single("file"),
  async (req, res) => {
    if (req.file) {
      const file = dataUri(req).content;
      const result = await uploadFile(
        file,
        req.body.fileName,
        req.user.username,
      );

      console.log(result);

      await uploadFileDB(
        req.user.id,
        Number(req.params.openedFolderId),
        result.secure_url,
        result.display_name,
      );
    }
    res.redirect("/");
  },
];

exports.getAllFiles = async (user) => {
  const files = await getAllFilesDB(user.id);
  files.forEach((file) => {
    const imageTag = createImageTagIcon(`${user.username}/${file.name}`);
    file.imageTag = imageTag;
  });
  return files;
};
