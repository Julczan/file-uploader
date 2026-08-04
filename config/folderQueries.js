const { prisma } = require("../lib/prisma");
const {
  getAllChildFolders,
  getFolderAndAllChildFolders,
} = require("../generated/prisma/sql");

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

exports.getAllUserFoldersDB = async (authorId) => {
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

exports.getFolderAndAllChildFoldersDB = async (folderId) => {
  const childFolders = await prisma.$queryRawTyped(
    getFolderAndAllChildFolders(folderId),
  );
  return childFolders;
};

exports.getFolderTitleByIdDB = async (folderId) => {
  const folderTitle = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { title: true },
  });
  return folderTitle.title;
};

exports.getFolderByTitle = async (folderTitle, authorId) => {
  const folder = await prisma.folder.findFirst({
    where: {
      AND: [{ title: folderTitle }, { authorId: authorId }],
    },
  });
  return folder;
};
