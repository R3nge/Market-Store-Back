-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "albumId" TEXT;

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "images" TEXT[],
    "productId" TEXT NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Album_productId_key" ON "Album"("productId");

-- CreateIndex
CREATE INDEX "albumId" ON "Product"("albumId");

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
