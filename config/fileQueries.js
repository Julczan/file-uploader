const { prisma } = require("../lib/prisma");

exports.uploadFileDB = async (authorId, folderId, url) => {
  await prisma.file.create({
    data: {
      authorId: authorId,
      folderId: folderId,
      url: url,
    },
  });
};
