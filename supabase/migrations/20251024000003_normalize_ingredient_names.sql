-- First, update recipe_ingredients to point to the lowercase version of ingredients
-- For each duplicate, keep the first one (alphabetically) and reassign all references
UPDATE recipe_ingredients ri
SET ingredient_id = (
  SELECT uid FROM ingredients i2
  WHERE LOWER(i2.name) = LOWER(i.name)
  ORDER BY i2.name
  LIMIT 1
)
FROM ingredients i
WHERE ri.ingredient_id = i.uid;

-- Delete duplicate ingredients (keeping only the first one alphabetically for each lowercase name)
DELETE FROM ingredients
WHERE uid NOT IN (
  SELECT DISTINCT ON (LOWER(name)) uid
  FROM ingredients
  ORDER BY LOWER(name), name
);

-- Now normalize all remaining ingredient names to lowercase
UPDATE ingredients
SET name = LOWER(name);

-- Add a constraint to ensure future ingredient names are lowercase
-- First, create a function to check if text is lowercase
CREATE OR REPLACE FUNCTION is_lowercase(text) RETURNS boolean AS $$
  SELECT $1 = LOWER($1);
$$ LANGUAGE SQL IMMUTABLE;

-- Add check constraint
ALTER TABLE ingredients
ADD CONSTRAINT ingredients_name_lowercase
CHECK (is_lowercase(name));
