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
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};
