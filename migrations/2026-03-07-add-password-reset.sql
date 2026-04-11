-- Migration: add password reset token columns to users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_reset_token TEXT,
  ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_password_reset_expires ON users (password_reset_expires);
