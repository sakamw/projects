-- Add security-related fields to User table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "two_factor_secret" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "login_alerts" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "last_password_change" TIMESTAMP(3);

-- Create UserSession table for active sessions management
CREATE TABLE IF NOT EXISTS "user_session" (
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "device_info" TEXT,
    "ip_address" TEXT,
    "location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_session_pkey" PRIMARY KEY ("session_id")
);

-- Create LoginHistory table for security audit log
CREATE TABLE IF NOT EXISTS "login_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "login_type" TEXT NOT NULL DEFAULT 'password',
    "ip_address" TEXT,
    "device_info" TEXT,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'success',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_history_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "user_session_user_id_idx" ON "user_session"("user_id");
CREATE INDEX IF NOT EXISTS "user_session_expires_at_idx" ON "user_session"("expires_at");
CREATE INDEX IF NOT EXISTS "login_history_user_id_idx" ON "login_history"("user_id");
CREATE INDEX IF NOT EXISTS "login_history_created_at_idx" ON "login_history"("created_at");

-- Add foreign keys
ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "login_history" ADD CONSTRAINT "login_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
