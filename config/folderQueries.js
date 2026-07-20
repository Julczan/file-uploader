const { prisma } = require("../lib/prisma");

exports.createFolderDB = async (title, authorId, parentId) => {
  await prisma.folder.create({
    data: { title: title, authorId: authorId, parentFolderId: parentId },
  });
};

exports.getAllFoldersDB = async () => {
  const folders = await prisma.folder.findMany({
    where: {
      parentFolder: null,
    },
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
