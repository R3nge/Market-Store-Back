/*
  Warnings:

  - You are about to drop the column `Name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `authExpires` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `authToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `middleName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_authToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Name",
DROP COLUMN "authExpires",
DROP COLUMN "authToken",
DROP COLUMN "role",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT NOT NULL,
ADD COLUMN     "type" "Role" NOT NULL DEFAULT 'Usuario';
