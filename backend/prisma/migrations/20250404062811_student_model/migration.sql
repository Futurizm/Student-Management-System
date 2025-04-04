-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "ei_contingent" TEXT NOT NULL,
    "id_contingent" TEXT NOT NULL,
    "iin" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "middlename" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "citizenship" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);
