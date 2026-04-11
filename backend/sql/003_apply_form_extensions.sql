-- Run manually in Supabase SQL (not auto-run from Git).
-- Extends applications for the multi-step public apply form.

ALTER TABLE applications ADD COLUMN IF NOT EXISTS identity_photo text;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS institution text;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS consent_accurate boolean NOT NULL DEFAULT false;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS consent_communications boolean NOT NULL DEFAULT false;
