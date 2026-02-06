[← Back to Main](../README.md) | [Setup](SETUP.md) | [Architecture](ARCHITECTURE.md) | [Tech Stack](TECH_STACK.md) | [Project Structure](PROJECT_STRUCTURE.md) | [Features](FEATURES.md) | [Deployment](DEPLOYMENT.md) | [Roadmap](ROADMAP.md)

---

# Database Schema

Dinder uses **PostgreSQL** via Supabase with the following key tables:

## Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `recipes` | Core recipe catalog | uid, name, creator, time, servings, category, difficulty, image, area |
| `ingredients` | Ingredient catalog (normalized) | uid, name |
| `recipe_ingredients` | Junction table for recipe ingredients | uid, recipe_id, ingredient_id, amount, unit, note |
| `directions` | Recipe step-by-step instructions | uid, recipe_id, sequence, description, image |
| `weekplans` | User meal plans | id, user_id, name, start_date, created_at |
| `weekplan_entries` | Individual meals in weekplans | id, weekplan_id, day_index, meal_type, recipe_id, sequence |
| `user_preferences` | User settings & preferences | id, user_id, language, notifications, measurements, dietary_preferences |
| `profiles` | User public information | id, email, full_name, avatar_url, username, address |
| `user_tried_recipes` | Recipe cooking history | user_id, recipe_id, tried_at |

---

## Security

All tables are protected with **Row Level Security (RLS)** policies:
- Public recipes are readable by everyone
- Recipe modifications restricted to owners
- User-specific data isolated by authentication

---

## Storage Buckets

- `recipe-images`: Stores uploaded recipe photos with automatic cleanup on deletion

Images are served via Cloudflare CDN through Supabase Storage.

---

[← Back to Main](../README.md) | [Setup](SETUP.md) | [Architecture](ARCHITECTURE.md) | [Tech Stack](TECH_STACK.md) | [Project Structure](PROJECT_STRUCTURE.md) | [Features](FEATURES.md) | [Deployment](DEPLOYMENT.md) | [Roadmap](ROADMAP.md)
