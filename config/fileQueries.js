const { prisma } = require("../lib/prisma");

exports.uploadFileDB = async (
  authorId,
  folderId,
  url,
  fileName,
  fileVersion,
  resourceType,
) => {
  await prisma.file.create({
    data: {
      authorId: authorId,
      folderId: folderId,
      url: url,
      name: fileName,
      version: fileVersion,
      resourceType: resourceType,
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

exports.getFileDetailsDB = async (fileId) => {
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });
  return file;
};

exports.getFilesInFolderDB = async (authorId, folderId) => {
  const files = await prisma.file.findMany({
    where: {
      folderId: folderId,
      authorId: authorId,
    },
  });
  return files;
};

exports.deleteFilesDB = async (folderId) => {
  await prisma.file.deleteMany({
    where: { folderId: folderId },
  });
};

exports.deleteSingleFileDB = async (fileId) => {
  await prisma.file.delete({
    where: { id: fileId },
  });
};

exports.getFileAuthor = async (fileId) => {
  const fileAuthor = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
    select: {
      authorId: true,
    },
  });
  return fileAuthor.authorId;
};
