-- Enable Row Level Security on recipe tables
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE directions ENABLE ROW LEVEL SECURITY;

-- Recipes policies
-- Everyone can view all recipes
CREATE POLICY "Anyone can view recipes"
ON recipes FOR SELECT
USING (true);

-- Authenticated users can insert recipes
CREATE POLICY "Authenticated users can insert recipes"
ON recipes FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND creator::uuid = auth.uid());

-- Users can update their own recipes
CREATE POLICY "Users can update own recipes"
ON recipes FOR UPDATE
USING (creator::uuid = auth.uid());

-- Users can delete their own recipes
CREATE POLICY "Users can delete own recipes"
ON recipes FOR DELETE
USING (creator::uuid = auth.uid());

-- Ingredients policies
-- Everyone can view ingredients
CREATE POLICY "Anyone can view ingredients"
ON ingredients FOR SELECT
USING (true);

-- Authenticated users can insert ingredients
CREATE POLICY "Authenticated users can insert ingredients"
ON ingredients FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Recipe_ingredients policies
-- Everyone can view recipe ingredients
CREATE POLICY "Anyone can view recipe_ingredients"
ON recipe_ingredients FOR SELECT
USING (true);

-- Authenticated users can insert recipe ingredients for their own recipes
CREATE POLICY "Users can insert recipe_ingredients for own recipes"
ON recipe_ingredients FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.uid = recipe_ingredients.recipe_id
    AND recipes.creator::uuid = auth.uid()
  )
);

-- Users can update recipe ingredients for their own recipes
CREATE POLICY "Users can update recipe_ingredients for own recipes"
ON recipe_ingredients FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.uid = recipe_ingredients.recipe_id
    AND recipes.creator::uuid = auth.uid()
  )
);

-- Users can delete recipe ingredients for their own recipes
CREATE POLICY "Users can delete recipe_ingredients for own recipes"
ON recipe_ingredients FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.uid = recipe_ingredients.recipe_id
    AND recipes.creator::uuid = auth.uid()
  )
);

-- Directions policies
-- Everyone can view directions
CREATE POLICY "Anyone can view directions"
ON directions FOR SELECT
USING (true);

-- Users can insert directions for their own recipes
CREATE POLICY "Users can insert directions for own recipes"
ON directions FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.uid = directions.recipe_id
    AND recipes.creator::uuid = auth.uid()
  )
);

-- Users can update directions for their own recipes
CREATE POLICY "Users can update directions for own recipes"
ON directions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.uid = directions.recipe_id
    AND recipes.creator::uuid = auth.uid()
  )
);

-- Users can delete directions for their own recipes
CREATE POLICY "Users can delete directions for own recipes"
ON directions FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.uid = directions.recipe_id
    AND recipes.creator::uuid = auth.uid()
  )
);
