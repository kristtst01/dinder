-- Improve weekplan structure
-- 1. Add sequence field to weekplan_entries to support multiple recipes per meal slot
-- 2. Make start_date NOT NULL on weekplans (every weekplan should have a start date)

-- Add sequence column to weekplan_entries
ALTER TABLE weekplan_entries
ADD COLUMN sequence INTEGER NOT NULL DEFAULT 0;

-- Make start_date required on weekplans
ALTER TABLE weekplans
ALTER COLUMN start_date SET NOT NULL;
