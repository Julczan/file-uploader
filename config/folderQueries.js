const { prisma } = require("../lib/prisma");

exports.createFolderDB = async (title, authorId) => {
  await prisma.folder.create({
    data: { title: title, authorId: authorId },
  });
};

exports.getAllFoldersDB = async () => {
  const folders = await prisma.folder.findMany();
  return folders;
};
