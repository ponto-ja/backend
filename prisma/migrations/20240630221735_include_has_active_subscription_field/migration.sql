/*
  Warnings:

  - Added the required column `has_active_subscription` to the `business_owners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business_owners" ADD COLUMN     "has_active_subscription" BOOLEAN NOT NULL;
