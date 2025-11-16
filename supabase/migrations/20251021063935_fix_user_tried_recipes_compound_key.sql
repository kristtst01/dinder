-- Drop the existing table and recreate with compound primary key
DROP TABLE IF EXISTS user_tried_recipes;

CREATE TABLE user_tried_recipes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(uid) ON DELETE CASCADE,
  tried_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, recipe_id)
);

-- Enable RLS
ALTER TABLE user_tried_recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only read/write their own tried recipes
CREATE POLICY "Users can view their own tried recipes"
  ON user_tried_recipes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark recipes as tried"
  ON user_tried_recipes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unmark their tried recipes"
  ON user_tried_recipes
  FOR DELETE
  USING (auth.uid() = user_id);
