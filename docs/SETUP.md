[← Back to Main](../README.md) | [Architecture](ARCHITECTURE.md) | [Tech Stack](TECH_STACK.md) | [Project Structure](PROJECT_STRUCTURE.md) | [Database](DATABASE.md) | [Features](FEATURES.md) | [Deployment](DEPLOYMENT.md) | [Roadmap](ROADMAP.md)

---

# Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.x or higher ([Download](https://nodejs.org/))
- **pnpm**: v9.x ([Installation](https://pnpm.io/installation))
  ```bash
  npm install -g pnpm
  ```
- **Supabase CLI**: For database migrations ([Installation](https://supabase.com/docs/guides/cli))
  ```bash
  npm install -g supabase
  ```
- **Supabase Account**: Sign up at [supabase.com](https://supabase.com)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kristtst01/dinder.git
cd dinder
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_ACCESS_TOKEN=your_supabase_access_token
```

**Where to find these values:**
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the **Project URL** and **anon/public key**
5. For the access token: **Settings** → **Access Tokens** → Generate new token

### 4. Database Setup

Link to your Supabase project:

```bash
supabase link --project-ref your-project-ref
```

Push migrations to create the database schema:

```bash
supabase db push
```

### 5. Run Development Server

```bash
pnpm dev
```

The application will be available at:
```
http://localhost:5173
```

---

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server with Hot Module Replacement

# Building
pnpm build            # Build for production (TypeScript compile + Vite build)
pnpm preview          # Preview production build locally

# Code Quality
pnpm lint             # Run ESLint to check for code issues
pnpm lint:fix         # Automatically fix ESLint issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check if code is formatted correctly
pnpm type-check       # Run TypeScript type checking without emitting files

# CI/CD
pnpm ci               # Run full CI pipeline (type-check + lint + format + build)
```

---

## Path Aliases

Configured in `vite.config.ts` for cleaner imports:

| Alias | Path |
|-------|------|
| `@features/` | `src/features/` |
| `@shared/` | `src/shared/` |
| `@common/` | `src/common/` |
| `@utils/` | `src/utils/` |
| `@types/` | `src/types/` |
| `@/` | `src/` |

**Example Usage:**
```typescript
import { useAuth } from '@common/hooks/use-auth';
import { RecipeCard } from '@shared/recipe-card';
import { HomePage } from '@features/home/pages/home-page';
```

---

[← Back to Main](../README.md) | [Architecture](ARCHITECTURE.md) | [Tech Stack](TECH_STACK.md) | [Project Structure](PROJECT_STRUCTURE.md) | [Database](DATABASE.md) | [Features](FEATURES.md) | [Deployment](DEPLOYMENT.md) | [Roadmap](ROADMAP.md)
