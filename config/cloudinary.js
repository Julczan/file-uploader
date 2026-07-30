const cloudinary = require("cloudinary").v2;

exports.uploadFileCloud = async (
  filePath,
  fileName,
  userName,
  openedFolderTitle,
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `${userName}/${openedFolderTitle}`,
      resource_type: "auto",
      public_id: fileName,
      unique_filename: true,
      use_filename: true,
      overwrite: true,
      invalidate: true,
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

exports.createFolderCloud = async (folderPath) => {
  await cloudinary.api.create_folder(folderPath);
};

exports.getAllAssetsInFolderCloud = async (folderTitle) => {
  const assets = await cloudinary.api.resources_by_asset_folder(folderTitle);
  return assets.resources;
};

exports.getAssetsByPublicId = async (publicId) => {
  const asset = await cloudinary.api.resources_by_ids(publicId);
  return asset;
};

exports.deleteAssetsCloud = async (publicIdsArray) => {
  await cloudinary.api.delete_resources(publicIdsArray);
};

exports.deleteFolderCloud = async (folderPath) => {
  await cloudinary.api.delete_folder(folderPath);
};

exports.updateFolderCloud = async (fromPath, toPath) => {
  await cloudinary.api.rename_folder(fromPath, toPath);
};
