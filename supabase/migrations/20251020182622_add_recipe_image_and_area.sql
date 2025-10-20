-- Add image and area columns to recipes table
ALTER TABLE recipes
ADD COLUMN image TEXT,
ADD COLUMN area TEXT;

-- Add index on area for better filtering performance
CREATE INDEX idx_recipes_area ON recipes(area);
