-- Supabase does NOT run this file automatically from your Git repo.
-- You must open Supabase Dashboard → SQL → New query, paste this file, then Run.
-- After it succeeds, redeploy Railway if the backend was erroring on INSERT/PATCH.

-- Run once if `status` does not exist yet.
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

UPDATE applications
SET status = 'pending'
WHERE status IS NULL OR trim(status) = '';

COMMENT ON COLUMN applications.status IS 'admission workflow: pending | approved | rejected (submitted optional legacy)';
