-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "allow_messages" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "profile_visibility" TEXT NOT NULL DEFAULT 'public',
ADD COLUMN     "show_email" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "show_phone" BOOLEAN NOT NULL DEFAULT false;
