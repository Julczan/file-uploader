/*
  Warnings:

  - Changed the type of `version` on the `File` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "version",
ADD COLUMN     "version" INTEGER NOT NULL;
