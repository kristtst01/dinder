[← Back to Main](../README.md) | [Setup](SETUP.md) | [Architecture](ARCHITECTURE.md) | [Tech Stack](TECH_STACK.md) | [Project Structure](PROJECT_STRUCTURE.md) | [Database](DATABASE.md) | [Deployment](DEPLOYMENT.md) | [Roadmap](ROADMAP.md)

---

# Feature Implementation Details

## Recipe Management

### Recipe Discovery
- **Filtering**: Browse recipes with advanced filtering (cuisine, difficulty, cooking time, dietary preferences)
- **URL-Based State**: Share filtered views with persistent URL parameters
- **Personal Cookbook**: Save favorite recipes with instant synchronization
- **Recipe Creation**: Upload custom recipes with images stored in Supabase Storage

### Image Upload
- Images uploaded to Supabase Storage (`recipe-images` bucket)
- Automatic image optimization and resizing
- Cascade delete when recipes are removed

### Ingredient Scaling
- Dynamic calculation based on user-selected servings
- Maintains original recipe ratios
- Supports fractional amounts

### Recipe Editor
- Rich form with ingredient and direction arrays
- Image upload with preview
- Validation for required fields
- Owner-only edit/delete permissions

---

## Meal Planning

### Weekplan Structure
- 7-day grid (Monday-Sunday)
- Multiple meal types per day (breakfast, lunch, dinner, snack)
- Recipe selection modal with search
- Optimistic UI updates

### Layouts
- **Desktop**: Table layout with columns for each day
- **Mobile**: Single-column layout with expandable days

---

## User Authentication

### Supabase Auth Integration
- Email/password authentication
- Google OAuth provider
- Session persistence across page reloads
- Automatic token refresh

### Custom `useAuth` Hook
```typescript
const { user, loading, signOut } = useAuth();
```
- Listens for auth state changes
- Provides user object and loading state
- Sign-out functionality

### Protected Routes
```typescript
<ProtectedRoute>
  <RecipeCreatePage />
</ProtectedRoute>
```
- Redirects unauthenticated users to landing page
- Shows loading spinner during auth check

---

## State Management

### React Query (Server State)
- Recipes, weekplans, and preferences managed with React Query
- Automatic background refetching
- Cache invalidation on mutations
- Optimistic updates for better UX

### React Context (Client State)
- `SavedRecipesContext`: Manages user's saved recipe IDs
- `ThemeProvider`: Dark/light mode toggle with persistence

### URL State
- Home page filters stored in URL parameters
- Enables shareable filtered views
- Browser back/forward navigation support

---

[← Back to Main](../README.md) | [Setup](SETUP.md) | [Architecture](ARCHITECTURE.md) | [Tech Stack](TECH_STACK.md) | [Project Structure](PROJECT_STRUCTURE.md) | [Database](DATABASE.md) | [Deployment](DEPLOYMENT.md) | [Roadmap](ROADMAP.md)
