const { prisma } = require("../lib/prisma");

exports.createFolderDB = async (title, authorId, parentId) => {
  await prisma.folder.create({
    data: { title: title, authorId: authorId, parentFolderId: parentId },
  });
};

exports.updateFolderDB = async (newTitle, folderId) => {
  await prisma.folder.update({
    where: { id: folderId },
    data: { title: newTitle },
  });
};

exports.getAllFoldersDB = async (authorId) => {
  const folders = await prisma.folder.findMany({
    where: {
      parentFolder: null,
      authorId: authorId,
    },
    orderBy: { title: "asc" },
  });
  return folders;
};

exports.getItemsInFolderDB = async (folderId) => {
  const folderItems = await prisma.folder.findUnique({
    where: { id: folderId },
    include: { childFolders: true, files: true },
  });
  return folderItems;
};

exports.deleteFolderDB = async (folderId) => {
  await prisma.folder.delete({
    where: { id: folderId },
  });
};
