-- CreateTable
CREATE TABLE "Photo" (
    "id" UUID NOT NULL,
    "url" VARCHAR NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drink" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" UUID,
    "pricesId" UUID,
    "photosId" UUID,
    "availableDays_sunday" BOOLEAN NOT NULL DEFAULT false,
    "availableDays_monday" BOOLEAN NOT NULL DEFAULT false,
    "availableDays_tuesday" BOOLEAN NOT NULL DEFAULT false,
    "availableDays_wednesday" BOOLEAN NOT NULL DEFAULT false,
    "availableDays_thursday" BOOLEAN NOT NULL DEFAULT false,
    "availableDays_friday" BOOLEAN NOT NULL DEFAULT false,
    "availableDays_saturday" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Drink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Drink" ADD CONSTRAINT "Drink_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drink" ADD CONSTRAINT "Drink_pricesId_fkey" FOREIGN KEY ("pricesId") REFERENCES "Price"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drink" ADD CONSTRAINT "Drink_photosId_fkey" FOREIGN KEY ("photosId") REFERENCES "Photo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
