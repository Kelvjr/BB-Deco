-- Run once in Supabase SQL editor (or psql) if `status` does not exist yet.
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

UPDATE applications
SET status = 'pending'
WHERE status IS NULL OR trim(status) = '';

COMMENT ON COLUMN applications.status IS 'admission workflow: pending | approved | rejected (submitted optional legacy)';
