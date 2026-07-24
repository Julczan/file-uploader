const { prisma } = require("../lib/prisma");

exports.uploadFileDB = async (authorId, folderId, url, fileName) => {
  await prisma.file.create({
    data: {
      authorId: authorId,
      folderId: folderId,
      url: url,
      name: fileName,
    },
  });
};

exports.getAllFilesDB = async (authorId) => {
  const files = await prisma.file.findMany({
    where: {
      folderId: null,
      authorId: authorId,
    },
  });
  return files;
};
