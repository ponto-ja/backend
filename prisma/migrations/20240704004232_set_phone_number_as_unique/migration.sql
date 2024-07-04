/*
  Warnings:

  - A unique constraint covering the columns `[phone_number]` on the table `participants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "participants_phone_number_key" ON "participants"("phone_number");
