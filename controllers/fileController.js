const multer = require("multer");
const multerUploads = require("../config/multer");
const { dataUri } = require("../config/dataUri");
const { uploadFile } = require("../config/cloudinary");
const { uploadFileDB, getAllFilesDB } = require("../config/fileQueries");
const upload = multer({ dest: "uploads/" });

exports.uploadFileFormGet = (req, res) => {
  res.render("uploadFileForm");
};

exports.fileDetailsGet = async (req, res, next) => {
  res.render("fileDetails");
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

exports.getAllFiles = async (req, res, next) => {};
