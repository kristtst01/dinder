[← Back to Main](../README.md) | [Setup](SETUP.md) | [Architecture](ARCHITECTURE.md) | [Tech Stack](TECH_STACK.md) | [Database](DATABASE.md) | [Features](FEATURES.md) | [Deployment](DEPLOYMENT.md) | [Roadmap](ROADMAP.md)

---

# Project Structure

```
dinder/
├── src/
│   ├── features/                # Feature modules (vertical slices)
│   │   ├── cookbook/           # Saved recipes & user cookbook
│   │   │   ├── pages/
│   │   │   └── ui/
│   │   ├── home/               # Browse & discover recipes
│   │   │   ├── pages/
│   │   │   └── ui/
│   │   ├── login/              # Authentication pages
│   │   │   ├── pages/
│   │   │   └── ui/
│   │   ├── preferences/        # User settings
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── repositories/
│   │   ├── profile/            # User profile management
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── repositories/
│   │   │   └── types/
│   │   ├── recipes/            # Recipe CRUD operations
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── weekplans/          # Weekly meal planning
│   │       ├── hooks/
│   │       ├── pages/
│   │       ├── repositories/
│   │       └── ui/
│   ├── shared/                 # Shared UI components
│   │   ├── navbar.tsx
│   │   ├── recipe-card.tsx
│   │   ├── weekplan-card.tsx
│   │   └── filter-panel.tsx
│   ├── common/                 # Common utilities & hooks
│   │   └── hooks/
│   │       ├── use-auth.ts
│   │       └── use-theme.tsx
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── empty-state.tsx
│   │   └── loading-spinner.tsx
│   ├── lib/                    # Third-party library configs
│   │   └── supabase/
│   │       ├── supabase.ts     # Supabase client
│   │       └── types.ts        # Generated types
│   ├── App.tsx                 # Root component with routing
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── supabase/
│   └── migrations/             # Database schema migrations
│       ├── 20250101_initial_schema.sql
│       ├── 20250102_add_weekplans.sql
│       └── ...
├── docs/                       # Documentation
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   ├── TECH_STACK.md
│   ├── PROJECT_STRUCTURE.md
│   ├── DATABASE.md
│   ├── FEATURES.md
│   ├── DEPLOYMENT.md
│   └── ROADMAP.md
├── public/                     # Static assets
│   ├── logo.svg
│   └── ...
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── eslint.config.js            # ESLint configuration
├── package.json                # Dependencies and scripts
└── pnpm-lock.yaml              # Lock file for reproducible builds
```

---

## Directory Explanations

### `/src/features`
Each feature is a self-contained vertical slice containing all the code needed for that feature (pages, hooks, repositories, types).

### `/src/shared`
UI components used across multiple features.

### `/src/common`
Utilities, hooks, and helpers used throughout the application.

### `/src/components`
Reusable UI components, including shadcn/ui components.

### `/src/lib`
Third-party library configurations and clients.

### `/supabase/migrations`
Database schema migrations in SQL format.

### `/docs`
Comprehensive documentation split into focused topics.

---

[← Back to Main](../README.md) | [Setup](SETUP.md) | [Architecture](ARCHITECTURE.md) | [Tech Stack](TECH_STACK.md) | [Database](DATABASE.md) | [Features](FEATURES.md) | [Deployment](DEPLOYMENT.md) | [Roadmap](ROADMAP.md)
