/*
  Warnings:

  - A unique constraint covering the columns `[iin]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_iin_key" ON "Student"("iin");
