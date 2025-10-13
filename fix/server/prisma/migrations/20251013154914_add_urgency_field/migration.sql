-- CreateEnum
CREATE TYPE "public"."ReportUrgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterTable
ALTER TABLE "public"."comment" ADD COLUMN     "parent_comment_id" TEXT;

-- AlterTable
ALTER TABLE "public"."report" ADD COLUMN     "urgency" "public"."ReportUrgency" NOT NULL DEFAULT 'MEDIUM',
ALTER COLUMN "mediaUrls" DROP NOT NULL,
ALTER COLUMN "mediaUrls" SET DEFAULT '[]',
ALTER COLUMN "mediaUrls" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "comment_parent_comment_id_idx" ON "public"."comment"("parent_comment_id");

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."comment"("comment_id") ON DELETE SET NULL ON UPDATE CASCADE;
