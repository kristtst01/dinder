[← Back to Main](../README.md) | [Setup](SETUP.md) | [Tech Stack](TECH_STACK.md) | [Project Structure](PROJECT_STRUCTURE.md) | [Database](DATABASE.md) | [Features](FEATURES.md) | [Deployment](DEPLOYMENT.md) | [Roadmap](ROADMAP.md)

---

# Architecture & Design Patterns

Dinder follows modern software engineering practices with a focus on maintainability and scalability.

## Feature-Based Architecture

The application uses **vertical slice architecture** where each feature contains its own:
- Pages/UI components
- Business logic hooks
- Data repositories
- Type definitions

This approach promotes:
- **High cohesion**: Related code stays together
- **Low coupling**: Features are independent
- **Easy navigation**: Logical folder structure

---

## Repository Pattern

Data access is abstracted through repository classes:
- `WeekplanRepository` - Meal plan CRUD operations
- `ProfileRepository` - User profile management
- `PreferenceRepository` - User settings management

Benefits:
- Single source of truth for data operations
- Easy to test and mock
- Consistent data access patterns

---

## Custom Hooks

Business logic is encapsulated in custom hooks:
- `useAuth()` - Authentication state management
- `useRecipes()` - Recipe fetching with React Query
- `usePreferences()` - User preference handling
- `useDebouncedSave()` - Optimistic updates with debouncing

---

## React Query for Server State

- Automatic background refetching
- Request deduplication
- Caching with stale-while-revalidate
- Optimistic updates

---

## Row Level Security (RLS)

Database access is secured at the PostgreSQL level:
- Public recipes readable by everyone
- Recipe modifications restricted to owners
- User-specific data isolated by authentication

---

## Protected Routes

Authentication guards prevent unauthorized access:
```typescript
<Route path="/recipe/create" element={
  <ProtectedRoute>
    <RecipeCreatePage />
  </ProtectedRoute>
} />
```

---

## Path Aliases

Clean imports with TypeScript path mapping:
```typescript
import { useAuth } from '@common/hooks/use-auth';
import { RecipeCard } from '@shared/recipe-card';
import { HomePage } from '@features/home/pages/home-page';
```

---

[← Back to Main](../README.md) | [Setup](SETUP.md) | [Tech Stack](TECH_STACK.md) | [Project Structure](PROJECT_STRUCTURE.md) | [Database](DATABASE.md) | [Features](FEATURES.md) | [Deployment](DEPLOYMENT.md) | [Roadmap](ROADMAP.md)
