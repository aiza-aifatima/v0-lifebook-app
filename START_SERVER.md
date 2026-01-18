# Starting the Lifebook Development Server

## Quick Start (30 seconds)

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Start the development server
npm run dev

# 3. Open browser
# Navigate to http://localhost:3000
```

## If You See "ERR_CONNECTION_REFUSED"

This error means the server isn't running. Follow these steps:

### Step 1: Kill Any Existing Processes
```bash
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows (PowerShell as Admin):
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Step 2: Clear Node Modules Cache
```bash
rm -rf node_modules .next
npm install
```

### Step 3: Start the Server
```bash
npm run dev
```

You should see output like:
```
> lifebook@0.1.0 dev
> next dev

  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.1s
```

### Step 4: Verify in Browser
- Go to `http://localhost:3000`
- You should see the Lifebook welcome page

## Common Issues & Solutions

### Issue: Port 3000 Already in Use
```bash
# Try running on a different port
npm run dev -- -p 3001

# Then access: http://localhost:3001
```

### Issue: "Module not found" Errors
```bash
# Clear all caches and reinstall
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

### Issue: Environment Variables Not Loading
```bash
# Verify you have .env.local file with:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Restart the server after changes
npm run dev
```

### Issue: "Cannot find module" for Supabase
```bash
npm install @supabase/ssr @supabase/supabase-js
npm run dev
```

### Issue: ESLint or TypeScript Errors
```bash
# Build anyway (development mode)
npm run dev

# Or fix errors:
npm run lint -- --fix
npm run dev
```

## Verify Everything is Working

1. **Server Running**: See "Ready in X.Xs" message ✓
2. **No Errors**: No red error messages ✓
3. **Browser Access**: Can reach http://localhost:3000 ✓
4. **Hot Reload**: Edit a file and it updates automatically ✓

## Environment Variables Checklist

Make sure you have a `.env.local` file with these variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

Get these from:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy URL and Anon Key

## Still Having Issues?

Run the diagnostic script:
```bash
npm run diagnose
```

This will check:
- Node.js version
- npm version
- Environment variables
- Port availability
- File permissions

## Production Deployment

When ready to deploy:
```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel
npm install -g vercel
vercel
```
