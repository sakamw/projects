-- CreateEnum
CREATE TYPE "public"."ReportCategory" AS ENUM ('IT', 'SECURITY', 'INFRASTRUCTURE', 'SANITATION', 'ELECTRICAL', 'WATER', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "public"."VoteType" AS ENUM ('UP', 'DOWN');

-- CreateTable
CREATE TABLE "public"."department" (
    "department_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "public"."report" (
    "report_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."ReportCategory" NOT NULL,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'PENDING',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "address" TEXT,
    "mediaUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "department_id" TEXT,

    CONSTRAINT "report_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "public"."report_assignment" (
    "assignment_id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "assigned_by_user_id" TEXT NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_assignment_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "public"."comment" (
    "comment_id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "public"."vote" (
    "vote_id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vote_type" "public"."VoteType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vote_pkey" PRIMARY KEY ("vote_id")
);

-- CreateTable
CREATE TABLE "public"."notification" (
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "report_id" TEXT,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "public"."user_points" (
    "user_id" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_points_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "public"."department"("name");

-- CreateIndex
CREATE INDEX "report_category_idx" ON "public"."report"("category");

-- CreateIndex
CREATE INDEX "report_status_idx" ON "public"."report"("status");

-- CreateIndex
CREATE INDEX "report_created_at_idx" ON "public"."report"("created_at");

-- CreateIndex
CREATE INDEX "comment_report_id_created_at_idx" ON "public"."comment"("report_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "vote_report_id_user_id_key" ON "public"."vote"("report_id", "user_id");

-- CreateIndex
CREATE INDEX "notification_user_id_is_read_idx" ON "public"."notification"("user_id", "is_read");

-- AddForeignKey
ALTER TABLE "public"."report" ADD CONSTRAINT "report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."report" ADD CONSTRAINT "report_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."report_assignment" ADD CONSTRAINT "report_assignment_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."report"("report_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."report_assignment" ADD CONSTRAINT "report_assignment_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."report_assignment" ADD CONSTRAINT "report_assignment_assigned_by_user_id_fkey" FOREIGN KEY ("assigned_by_user_id") REFERENCES "public"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."report"("report_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vote" ADD CONSTRAINT "vote_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."report"("report_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vote" ADD CONSTRAINT "vote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."report"("report_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_points" ADD CONSTRAINT "user_points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
