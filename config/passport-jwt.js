const jwt = require("jsonwebtoken");
const { getItemsInFolderDB } = require("./folderQueries");
const { getImageIconPlaceholder, createImageTagIcon } = require("./cloudinary");

exports.signToken = (duration, folderId, host) => {
  const payload = { folderId: folderId };
  const secret = process.env.JWT_SECRET;

  const token = jwt.sign(
    {
      data: payload,
    },
    secret,
    { expiresIn: duration },
  );

  const link = "https://" + host + "/share/" + token;

  return link;
};

exports.authenticateToken = (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const folderId = Number(decoded.data.folderId);
    const folderItems = await getItemsInFolderDB(folderId);

    const files = folderItems.files;

    for (const file of files) {
      let imageTag = "";
      if (file.resourceType === "raw") {
        imageTag = getImageIconPlaceholder();
      } else {
        imageTag = createImageTagIcon(
          file.name,
          file.version,
          file.resourceType,
        );
      }
      file.imageTag = imageTag;
    }

    res.render("folders", {
      folders: folderItems.childFolders,
      files: files,
    });
  });
};
