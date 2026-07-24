const { prisma } = require("./lib/prisma");

async function main() {
  // await prisma.folder.create({
  //   data: {
  //     title: "first folder",
  //     authorId: 3,
  //     childFolders: {
  //       create: {
  //         title: "child folder",
  //         authorId: 3,
  //       },
  //     },
  //   },
  // });
  // await prisma.user.update({
  //   where: { id: 4 },
  //   data: { folders: { create: { title: "second folder" } } },
  // });

  await prisma.file.deleteMany();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
