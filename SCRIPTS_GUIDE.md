# Available npm Scripts

## Development Scripts

### `npm run dev`
Starts the Next.js development server on port 3000 with hot reload.

```bash
npm run dev
# Server starts at: http://localhost:3000
```

**What happens:**
- Watches for file changes
- Auto-reloads components
- Shows TypeScript errors
- Enables debug logging

### `npm run dev -- -p 3001`
Start on a different port if 3000 is busy.

```bash
npm run dev -- -p 3001
# Server starts at: http://localhost:3001
```

## Build & Production

### `npm run build`
Creates an optimized production build.

```bash
npm run build
# Creates .next folder with optimized code
```

### `npm start`
Runs the production server (requires `npm run build` first).

```bash
npm run build
npm start
# Serves optimized production build
```

## Quality Assurance

### `npm run lint`
Runs ESLint to check code quality.

```bash
npm run lint
# Shows all linting issues
```

### `npm run lint -- --fix`
Auto-fixes common linting issues.

```bash
npm run lint -- --fix
# Auto-fixes formatting, imports, etc.
```

## Diagnostics

### `npm run diagnose` (Custom Script)
Checks your development environment setup.

```bash
npm run diagnose
# Verifies:
# - Node.js and npm versions
# - Environment variables
# - Port availability
# - Required files
```

**Add this to package.json:**
```json
{
  "scripts": {
    "diagnose": "node scripts/diagnose.js"
  }
}
```

## Database

### Database Migrations
Apply SQL scripts in order:

```bash
# 1. Schema setup
psql -U postgres -d lifebook -f scripts/001-create-database-schema.sql

# 2. RLS Policies
psql -U postgres -d lifebook -f scripts/002-enable-rls-policies.sql

# 3. Seed data
psql -U postgres -d lifebook -f scripts/003-seed-avatars-and-data.sql

# 4. Helper functions
psql -U postgres -d lifebook -f scripts/004-add-helper-functions.sql

# 5. OTP system
psql -U postgres -d lifebook -f scripts/005-add-otp-system.sql
```

**Or use Supabase SQL editor:**
1. Go to Supabase Dashboard
2. Project → SQL Editor
3. Paste each script and run

## Debugging

### Enable Debug Logging
Add to your terminal:

```bash
DEBUG=* npm run dev
```

This shows all internal Next.js debug information.

### TypeScript Type Checking
```bash
npx tsc --noEmit
# Checks TypeScript without building
```

### Check Build Size
```bash
npm run build -- --analyze
# Shows bundle size breakdown
```

## Cleanup

### Clear Cache
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Kill Development Server
```bash
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell as Admin):
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Environment Variables

### Set for Development Only
```bash
# Add to .env.local (not committed to git)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### Set for All Environments
```bash
# Add to .env (committed to git, public values only)
NEXT_PUBLIC_APP_NAME=Lifebook
```

### Set for Production Only
```bash
# Add to production deployment settings
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
```

## Git Workflows

### Commit Code
```bash
git add .
git commit -m "feat: add OTP password reset system"
git push origin main
```

### View Changes
```bash
git status
git diff
```

## Docker (Optional)

### Build Docker Image
```bash
docker build -t lifebook .
```

### Run Docker Container
```bash
docker run -p 3000:3000 lifebook
```

## Vercel Deployment

### Install Vercel CLI
```bash
npm install -g vercel
```

### Deploy
```bash
vercel
# Follow prompts to connect and deploy
```

### View Logs
```bash
vercel logs
```

## Monitoring

### Check Memory Usage
```bash
npm run dev
# Look at top of output for memory info
```

### Profile Performance
```bash
node --prof node_modules/.bin/next dev
# Generates v8 profile for analysis
```

## Tips & Tricks

### Fast Rebuild on Big Changes
```bash
rm -rf .next && npm run dev
```

### Run Multiple Instances
```bash
# Terminal 1:
npm run dev -- -p 3000

# Terminal 2:
npm run dev -- -p 3001
```

### Test Production Build Locally
```bash
npm run build
npm start
# Now at http://localhost:3000 with production code
```

### Monitor File Changes
```bash
npm run dev
# Edit a file and see instant updates
```
