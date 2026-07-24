const multer = require("multer");
const multerUploads = require("../config/multer");
const { dataUri } = require("../config/dataUri");
const { uploadFile } = require("../config/cloudinary");
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
      await uploadFile(file, req.body.fileName, req.user.username);
    }
    res.redirect("/files/upload");
  },
];
