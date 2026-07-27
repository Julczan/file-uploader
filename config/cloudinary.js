const cloudinary = require("cloudinary").v2;

exports.uploadFile = async (filePath, fileName, userName, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `${userName}/${folderName}`,
      resource_type: "auto",
      public_id: fileName,
      unique_filename: true,
      use_filename: true,
      overwrite: true,
    });
    return result;
  } catch (error) {
    console.error(error);
  }
};

exports.getFileDetialsCloud = async (fileName) => {
  const result = await cloudinary.api.resource(fileName);
  return result;
};

exports.createImageTagDetails = (publicId) => {
  let imageTag = cloudinary.url(publicId, {
    transformation: [
      { height: "400", format: "auto", quality: "auto", crop: "auto" },
    ],
  });

  return imageTag;
};

exports.createImageTagIcon = (publicId) => {
  let imageTag = cloudinary.url(publicId, {
    transformation: [
      {
        width: "32",
        height: "32",
        format: "auto",
        quality: "auto:low",
        crop: "auto",
      },
    ],
  });

  return imageTag;
};
