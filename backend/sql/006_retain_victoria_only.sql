-- DANGER: deletes every application that is NOT Kumedzro Victoria.
-- Run only after backup. Adjust the predicate if the stored name differs slightly.

BEGIN;

-- Optional: also remove orphan students that no longer have a matching application
-- DELETE FROM students s WHERE NOT EXISTS (
--   SELECT 1 FROM applications a WHERE a.id::text = s.application_id
-- );

DELETE FROM applications
WHERE NOT (
  lower(btrim(COALESCE(full_name, ''))) = lower('Kumedzro Victoria')
  OR (
    lower(btrim(COALESCE(full_name, ''))) LIKE '%kumedzro%'
    AND lower(btrim(COALESCE(full_name, ''))) LIKE '%victoria%'
  )
);

COMMIT;
