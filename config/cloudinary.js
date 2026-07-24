const cloudinary = require("cloudinary").v2;

exports.uploadFile = async (filePath, fileName, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
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

exports.getFileDetials = async (fileName) => {
  const result = await cloudinary.api.resource(fileName);
  return result;
};
