[← Back to Main](../README.md) | [Setup](SETUP.md) | [Architecture](ARCHITECTURE.md) | [Tech Stack](TECH_STACK.md) | [Project Structure](PROJECT_STRUCTURE.md) | [Database](DATABASE.md) | [Features](FEATURES.md) | [Roadmap](ROADMAP.md)

---

# Deployment

## Vercel Deployment

### Recommended Settings

- **Framework Preset**: Vite
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`
- **Node Version**: 20.x

---

### Environment Variables

Set the following in your Vercel project settings:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### Deployment Steps

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy

---

### Automatic Deployments

- Main branch deploys to production
- Pull requests create preview deployments

---

[← Back to Main](../README.md) | [Setup](SETUP.md) | [Architecture](ARCHITECTURE.md) | [Tech Stack](TECH_STACK.md) | [Project Structure](PROJECT_STRUCTURE.md) | [Database](DATABASE.md) | [Features](FEATURES.md) | [Roadmap](ROADMAP.md)
