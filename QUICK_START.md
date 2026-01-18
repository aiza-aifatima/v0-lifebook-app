# Lifebook - Quick Start (5 Minutes)

## Step 1: Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com) → Sign up/Login
2. Click "New Project"
3. Name it "lifebook"
4. Set password
5. Click "Create new project"
6. ⏳ Wait for initialization

---

## Step 2: Get Credentials (1 min)

1. Project dashboard opens
2. Click **Settings** → **API**
3. Copy:
   - **Project URL** (blue box)
   - **Anon Key** (public key)

---

## Step 3: Configure Local App (1 min)

1. Create file: `.env.local` in project root
2. Paste:
```env
NEXT_PUBLIC_SUPABASE_URL=<paste-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste-anon-key>
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

---

## Step 4: Run Database Setup (1 min)

1. In Supabase dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **+ New Query**
4. Copy content from `scripts/001-create-database-schema.sql`
5. Paste and execute
6. Repeat for:
   - `scripts/002-enable-rls-policies.sql`
   - `scripts/003-seed-avatars-and-data.sql`
   - `scripts/005-add-otp-system.sql`

---

## Step 5: Start App (Instant)

```bash
npm install
npm run dev
```

Visit: **http://localhost:3000** ✅

---

## Test It Now

### Try Sign Up
1. Click "Sign Up"
2. Enter email & password
3. Get verification email (or check console for code)
4. Verify and login

### Try Password Reset
1. Click "Forgot Password"
2. Enter your email
3. You'll get OTP code (or see in console)
4. Enter 6-digit code
5. Set new password
6. Login with new password

---

## Common Issues

**"URL and Key required"**
- Add `.env.local` file (check Step 3)
- Restart dev server: `npm run dev`

**"Connection timeout"**
- Check internet connection
- Verify Supabase project is active
- Copy URL correctly (no extra spaces)

**"Email not received"**
- Check browser console for logs
- Look in spam/junk folder
- Wait 1-2 minutes

**"Port 3000 in use"**
- Kill process: `lsof -ti:3000 | xargs kill -9`
- Or use different port: `npm run dev -- -p 3001`

---

## What's Ready to Use

✅ User authentication
✅ OTP-based password reset
✅ Avatar system
✅ Task management
✅ LifeCoins currency
✅ Mood tracking
✅ Social features
✅ Real-time updates

---

## Next Steps

- Customize avatars in `components/avatar-selection.tsx`
- Add more quests in `lib/tasks-context.tsx`
- Configure email templates in Supabase
- Deploy to Vercel (see DEPLOYMENT_CHECKLIST.md)

---

## Helpful Links

- **Full Setup Guide:** `SETUP_GUIDE.md`
- **Deployment Guide:** `DEPLOYMENT_CHECKLIST.md`
- **OTP Details:** `OTP_PASSWORD_RESET_IMPLEMENTATION.md`
- **Environment Variables:** `ENV_SETUP.md`

---

**Created by Aiza Fatima (Azauresthic)**

That's it! You now have a fully functional gamified life management app with secure OTP-based password reset. 🚀
