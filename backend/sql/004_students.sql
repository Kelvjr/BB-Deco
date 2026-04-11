-- Run manually in Supabase SQL. Creates student profiles when applications are approved.
-- Sequence is shared across years; student_number includes the calendar year prefix.

CREATE SEQUENCE IF NOT EXISTS student_number_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_number text NOT NULL UNIQUE,
  application_id text NOT NULL UNIQUE,
  full_name text,
  email text,
  phone text,
  program_applied text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_students_application_id ON students (application_id);

COMMENT ON TABLE students IS 'Enrolled/admitted person; created when an application is marked approved.';
