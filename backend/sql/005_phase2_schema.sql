-- Run manually in Supabase SQL. Phase 2: students stream, programs, announcements.
-- Safe to re-run: uses IF NOT EXISTS / IF NOT EXISTS column patterns.

-- Students: admission stream + status + optional profile image (URL or data URL)
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS admission_type text NOT NULL DEFAULT 'enrolled';
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS profile_image text;
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS notes text;

COMMENT ON COLUMN students.admission_type IS 'enrolled | apprenticeship';
COMMENT ON COLUMN students.status IS 'active | graduated | withdrawn | suspended';

-- Programs (manageable courses; applications may still use free-text program_applied)
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration text,
  description text,
  curriculum jsonb DEFAULT '[]'::jsonb,
  admission_requirements text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_programs_status ON programs (status);

-- Announcements (draft / sent tracking; actual email/SMS later)
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  audience text DEFAULT 'all',
  status text NOT NULL DEFAULT 'draft',
  send_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements (status);
