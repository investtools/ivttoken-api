-- CreateEnum
CREATE TYPE "ConnectionQuality" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "Months" AS ENUM ('JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC');

-- CreateEnum
CREATE TYPE "Entity" AS ENUM ('GOVERNMENT', 'GIGA', 'UNICEF', 'INVESTTOOLS');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateEnum
CREATE TYPE "Administrators" AS ENUM ('MUNICIPALITY', 'STATE');

-- CreateEnum
CREATE TYPE "Benefits" AS ENUM ('TAX_BREAK');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SCHOOL', 'ADMIN', 'ISP', 'SUPER_USER');

-- CreateTable
CREATE TABLE "Schools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "tokens" TEXT,
    "cnpj" TEXT NOT NULL,
    "inepCode" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "administrator" "Administrators" NOT NULL,
    "internetServiceProviderId" TEXT,
    "schoolAdminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolAdmin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectivityReport" (
    "id" TEXT NOT NULL,
    "month" "Months" NOT NULL,
    "noInternetDays" INTEGER NOT NULL,
    "connectionQuality" "ConnectionQuality" NOT NULL,
    "averageSpeed" INTEGER NOT NULL,
    "connectivityPercentage" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "schoolAdminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectivityReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entity" "Entity" NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuperUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuperUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternetServiceProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "tokenAmount" TEXT NOT NULL,
    "unlockedTokens" TEXT NOT NULL,
    "lockedTokens" TEXT NOT NULL,
    "spentTokens" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternetServiceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenTransactions" (
    "id" TEXT NOT NULL,
    "benefit" "Benefits" NOT NULL,
    "benefitPrice" TEXT NOT NULL,
    "internetServiceProviderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contracts" (
    "id" TEXT NOT NULL,
    "schoolsId" TEXT NOT NULL,
    "internetServiceProviderId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "adminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contracts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Schools_cnpj_key" ON "Schools"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Schools_inepCode_key" ON "Schools"("inepCode");

-- CreateIndex
CREATE UNIQUE INDEX "Schools_email_key" ON "Schools"("email");

-- CreateIndex
CREATE INDEX "Schools_cnpj_idx" ON "Schools"("cnpj");

-- CreateIndex
CREATE INDEX "Schools_email_idx" ON "Schools"("email");

-- CreateIndex
CREATE INDEX "Schools_city_idx" ON "Schools"("city");

-- CreateIndex
CREATE INDEX "Schools_state_idx" ON "Schools"("state");

-- CreateIndex
CREATE INDEX "Schools_internetServiceProviderId_idx" ON "Schools"("internetServiceProviderId");

-- CreateIndex
CREATE INDEX "Schools_schoolAdminId_idx" ON "Schools"("schoolAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolAdmin_email_key" ON "SchoolAdmin"("email");

-- CreateIndex
CREATE INDEX "SchoolAdmin_email_idx" ON "SchoolAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Admin_email_idx" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SuperUser_email_key" ON "SuperUser"("email");

-- CreateIndex
CREATE INDEX "SuperUser_email_idx" ON "SuperUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InternetServiceProvider_cnpj_key" ON "InternetServiceProvider"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "InternetServiceProvider_email_key" ON "InternetServiceProvider"("email");

-- CreateIndex
CREATE INDEX "InternetServiceProvider_email_idx" ON "InternetServiceProvider"("email");

-- CreateIndex
CREATE INDEX "InternetServiceProvider_cnpj_idx" ON "InternetServiceProvider"("cnpj");

-- CreateIndex
CREATE INDEX "TokenTransactions_internetServiceProviderId_idx" ON "TokenTransactions"("internetServiceProviderId");

-- CreateIndex
CREATE INDEX "Contracts_internetServiceProviderId_idx" ON "Contracts"("internetServiceProviderId");

-- CreateIndex
CREATE INDEX "Contracts_schoolsId_idx" ON "Contracts"("schoolsId");

-- AddForeignKey
ALTER TABLE "Schools" ADD CONSTRAINT "Schools_internetServiceProviderId_fkey" FOREIGN KEY ("internetServiceProviderId") REFERENCES "InternetServiceProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schools" ADD CONSTRAINT "Schools_schoolAdminId_fkey" FOREIGN KEY ("schoolAdminId") REFERENCES "SchoolAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectivityReport" ADD CONSTRAINT "ConnectivityReport_schoolAdminId_fkey" FOREIGN KEY ("schoolAdminId") REFERENCES "SchoolAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectivityReport" ADD CONSTRAINT "ConnectivityReport_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "Schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenTransactions" ADD CONSTRAINT "TokenTransactions_internetServiceProviderId_fkey" FOREIGN KEY ("internetServiceProviderId") REFERENCES "InternetServiceProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_internetServiceProviderId_fkey" FOREIGN KEY ("internetServiceProviderId") REFERENCES "InternetServiceProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_schoolsId_fkey" FOREIGN KEY ("schoolsId") REFERENCES "Schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
