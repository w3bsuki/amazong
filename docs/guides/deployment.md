# Deployment Guide

Deploying Treido to production.

## Environments

| Environment | URL | Branch |
|-------------|-----|--------|
| Development | localhost:3000 | - |
| Preview | *.vercel.app | PR branches |
| Production | treido.eu | main |

## Vercel Deployment

### Initial Setup

1. Connect GitHub repo to Vercel
2. Configure environment variables
3. Set Node.js version to 20.x
4. Enable automatic deployments

### Environment Variables

Required in Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=
```

### Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy production
vercel --prod
```

## Build Process

```bash
# Local build test
pnpm build

# Check bundle size
pnpm analyze  # if configured
```

### Build Checks

The build will fail if:

- TypeScript errors exist
- ESLint errors exist
- Tests fail (if configured in CI)

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm typecheck
      - run: pnpm test:unit
      - run: pnpm build
```

## Database Migrations

### Supabase Migrations

```bash
# Create migration
supabase migration new add_column

# Apply locally
supabase db reset

# Push to production
supabase db push
```

## Rollback

### Vercel Rollback

1. Go to Vercel dashboard
2. Deployments tab
3. Find previous successful deployment
4. Click "..." → "Promote to Production"

### Database Rollback

```bash
# List migrations
supabase migration list

# Rollback last migration
supabase migration repair --status reverted <version>
```

## Monitoring

- **Vercel Analytics** — Core Web Vitals
- **Vercel Logs** — Function logs
- **Supabase Dashboard** — Database metrics
- **Stripe Dashboard** — Payment metrics
