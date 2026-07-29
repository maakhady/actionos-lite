-- CreateEnum
CREATE TYPE "Priorite" AS ENUM ('BASSE', 'MOYENNE', 'HAUTE');

-- CreateEnum
CREATE TYPE "Statut" AS ENUM ('A_FAIRE', 'EN_COURS', 'TERMINE');

-- CreateEnum
CREATE TYPE "Origine" AS ENUM ('REGLE', 'IA', 'MANUEL');

-- CreateTable
CREATE TABLE "CompteRendu" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "dateReunion" TIMESTAMP(3) NOT NULL,
    "texteSource" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompteRendu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "compteRenduId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsable" TEXT,
    "echeance" TIMESTAMP(3),
    "priorite" "Priorite" NOT NULL DEFAULT 'MOYENNE',
    "statut" "Statut" NOT NULL DEFAULT 'A_FAIRE',
    "origine" "Origine" NOT NULL DEFAULT 'REGLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Action_compteRenduId_idx" ON "Action"("compteRenduId");

-- CreateIndex
CREATE INDEX "Action_statut_idx" ON "Action"("statut");

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_compteRenduId_fkey" FOREIGN KEY ("compteRenduId") REFERENCES "CompteRendu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
