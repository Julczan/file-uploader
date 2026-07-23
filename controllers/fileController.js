const multer = require("multer");
const upload = multer({ dest: "uploads/" });

exports.uploadFileFormGet = (req, res) => {
  res.render("uploadFileForm");
};

exports.uploadFileFormPost = [
  upload.single("file"),
  (req, res, next) => {
    console.log(req.file);
    res.redirect("/");
  },
];

exports.fileDetailsGet = async (req, res, next) => {
  res.render("fileDetails");
};
