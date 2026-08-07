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
      invalidate: true,
      unique_filename: true,
      use_filename: true,
      overwrite: true,
    });
    return result;
  } catch (error) {
    console.error(error);
  }
};

exports.getFileDetialsCloud = async (fileName, resourceType) => {
  const options = { resource_type: resourceType };
  const result = await cloudinary.api.resource(fileName, options);
  return result;
};

exports.createImageTagDetails = (publicId, version) => {
  let imageTag = cloudinary.image(publicId, {
    transformation: [
      {
        format: "auto",
        quality: "auto",
      },
    ],
    version: version,
  });

  return imageTag;
};

exports.createVideoTagDetails = (publicId, version) => {
  let videoTag = cloudinary.video(publicId, {
    version: version,
    loop: true,
    controls: true,
    transformation: {
      height: 360,
      width: 480,
      quality: 70,
      duration: 10,
      crop: "pad",
    },
    fallback_content: "Your browser does not support HTML5 video tags.",
  });

  return videoTag;
};

exports.createImageTagIcon = (publicId, version, resourceType) => {
  let imageTag = cloudinary.url(publicId, {
    resource_type: resourceType,
    transformation: [
      {
        width: "32",
        height: "32",
        quality: "auto:low",
        crop: "auto",
      },
    ],
    format: "jpg",
    version: version,
    page: 1,
  });

  return imageTag;
};

exports.getImageDetailsPlaceholder = () => {
  const placeholderUrl = "samples/logo.png";

  const imageTag = cloudinary.image(placeholderUrl, {
    transformation: [
      {
        quality: "auto",
      },
    ],
  });
  return imageTag;
};

exports.getImageIconPlaceholder = () => {
  const placeholderUrl = "samples/logo.png";

  const imageTag = cloudinary.url(placeholderUrl, {
    transformation: [
      {
        width: "32",
        height: "32",
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

exports.deleteAssetsCloud = async (publicIdsArray, resourceType) => {
  const options = { resource_type: resourceType };
  await cloudinary.api.delete_resources(publicIdsArray, options);
};

exports.deleteFolderCloud = async (folderPath) => {
  await cloudinary.api.delete_folder(folderPath);
};

exports.updateFolderCloud = async (fromPath, toPath) => {
  await cloudinary.api.rename_folder(fromPath, toPath);
};
