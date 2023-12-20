/*
  Warnings:

  - The values [User] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('Camisa', 'Camiseta', 'Casaco', 'Bermusa', 'Jeans', 'Tenis');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('Usuario', 'Admin');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'Usuario';
COMMIT;

-- DropIndex
DROP INDEX "Product_id_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'Camisa';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'Usuario';

-- CreateIndex
CREATE UNIQUE INDEX "Product_nome_key" ON "Product"("nome");
