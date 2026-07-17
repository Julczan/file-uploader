const { prisma } = require("../lib/prisma");

exports.createUser = async (username, email, hashedPassword) => {
  await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hashedPassword,
    },
  });
};

exports.findUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username: username },
  });
  return user;
};

exports.findUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });
  return user;
};

exports.findUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  return user;
};

exports.getItemsInFolderDB = async (folderId) => {
  const folderItems = await prisma.folder.findUnique({
    where: { id: folderId },
    include: { childFolders: true, files: true },
  });
  return folderItems;
};
