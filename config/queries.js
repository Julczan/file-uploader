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
