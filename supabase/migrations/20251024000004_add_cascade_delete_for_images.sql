-- Function to delete recipe images from storage when recipe is deleted
CREATE OR REPLACE FUNCTION delete_recipe_images()
RETURNS TRIGGER AS $$
DECLARE
  image_path text;
BEGIN
  -- Delete main recipe image if it exists
  IF OLD.image IS NOT NULL AND OLD.image != '' THEN
    -- Extract the path after 'recipe-images/'
    image_path := split_part(OLD.image, '/recipe-images/', 2);
    IF image_path IS NOT NULL AND image_path != '' THEN
      DELETE FROM storage.objects
      WHERE bucket_id = 'recipe-images'
        AND name = image_path;
    END IF;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete step images from storage when direction is deleted
CREATE OR REPLACE FUNCTION delete_direction_images()
RETURNS TRIGGER AS $$
DECLARE
  image_path text;
BEGIN
  -- Delete step image if it exists
  IF OLD.image IS NOT NULL AND OLD.image != '' THEN
    -- Extract the path after 'recipe-images/'
    image_path := split_part(OLD.image, '/recipe-images/', 2);
    IF image_path IS NOT NULL AND image_path != '' THEN
      DELETE FROM storage.objects
      WHERE bucket_id = 'recipe-images'
        AND name = image_path;
    END IF;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to delete recipe images when recipe is deleted
DROP TRIGGER IF EXISTS trigger_delete_recipe_images ON recipes;
CREATE TRIGGER trigger_delete_recipe_images
  BEFORE DELETE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION delete_recipe_images();

-- Trigger to delete direction images when direction is deleted
DROP TRIGGER IF EXISTS trigger_delete_direction_images ON directions;
CREATE TRIGGER trigger_delete_direction_images
  BEFORE DELETE ON directions
  FOR EACH ROW
  EXECUTE FUNCTION delete_direction_images();

-- Also ensure CASCADE DELETE is set up for recipe_ingredients and directions
-- (This might already be set up, but we'll make sure)
ALTER TABLE recipe_ingredients
  DROP CONSTRAINT IF EXISTS recipe_ingredients_recipe_id_fkey,
  ADD CONSTRAINT recipe_ingredients_recipe_id_fkey
    FOREIGN KEY (recipe_id)
    REFERENCES recipes(uid)
    ON DELETE CASCADE;

ALTER TABLE directions
  DROP CONSTRAINT IF EXISTS directions_recipe_id_fkey,
  ADD CONSTRAINT directions_recipe_id_fkey
    FOREIGN KEY (recipe_id)
    REFERENCES recipes(uid)
    ON DELETE CASCADE;
