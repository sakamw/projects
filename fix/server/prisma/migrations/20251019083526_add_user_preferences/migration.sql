-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "email_notifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "push_notifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'light',
ADD COLUMN     "weekly_digest" BOOLEAN NOT NULL DEFAULT false;
