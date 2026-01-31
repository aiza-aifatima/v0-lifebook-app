# Lifebook - Complete Setup Guide

## Overview

Lifebook is a full-stack gamified life management application featuring OTP-based password reset, real-time notifications, social features, and psychological gamification mechanics. This guide covers setup, deployment, and troubleshooting.

---

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- Git (for version control)
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## Step 1: Clone & Install

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd lifebook

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local  # or manually create it
\`\`\`

---

## Step 2: Supabase Setup

### Create a Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub or email
4. Create a new project
5. Wait for the project to initialize (~5 minutes)

### Get Your Credentials

1. In Supabase dashboard, go to **Settings → API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon Key** (public key)

### Configure Environment

Create `.env.local` in project root:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

---

## Step 3: Database Migration

### Run SQL Scripts in Order

1. **Create Schema & Tables:**
   - Log into Supabase SQL Editor
   - Copy content from `scripts/001-create-database-schema.sql`
   - Paste and execute

2. **Enable RLS Policies:**
   - Copy content from `scripts/002-enable-rls-policies.sql`
   - Paste and execute

3. **Seed Avatar Data:**
   - Copy content from `scripts/003-seed-avatars-and-data.sql`
   - Paste and execute

4. **Add OTP System:**
   - Copy content from `scripts/005-add-otp-system.sql`
   - Paste and execute

### Verify Tables Created

Check in Supabase → Table Editor. You should see:
- ✅ profiles
- ✅ tasks
- ✅ avatars
- ✅ password_reset_otp (most important for password reset)
- ✅ posts, comments, notifications, etc.

---

## Step 4: Email Configuration (OTP)

### Enable Email Verification

1. Go to **Auth → Providers**
2. Click **Email**
3. Configure:
   - ✅ "Enable email confirmations"
   - ✅ Set confirmation validity to 24 hours
4. Save

### Email Templates

1. Go to **Auth → Email Templates**
2. Customize if desired (optional, defaults work)
3. The app will send OTP via email automatically

### Test Email Delivery

1. Create a test account with sign-up
2. Check email inbox for verification
3. Proceed to password reset flow
4. Verify OTP arrives in 1-2 minutes

---

## Step 5: Run Locally

\`\`\`bash
# Start development server
npm run dev

# Server starts on http://localhost:3000
\`\`\`

### Expected Output

\`\`\`
> next dev

  ▲ Next.js 15.0.1
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 1.2s
\`\`\`

### Test the Application

1. Open http://localhost:3000
2. You should see the Welcome Screen
3. Click "Sign Up" to create account
4. Verify email
5. Log in
6. Test OTP password reset:
   - Logout
   - Click "Forgot Password"
   - Enter email
   - Check email for OTP
   - Enter OTP code
   - Set new password

---

## Troubleshooting

### Issue: Cannot reach localhost:3000

**Solution:**
\`\`\`bash
# Kill any process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Restart dev server
npm run dev
\`\`\`

### Issue: "Your project's URL and Key are required"

**Solution:**
1. Verify `.env.local` exists in project root
2. Check values are correct (no extra spaces)
3. Restart dev server: `npm run dev`
4. Check browser console (F12) for errors

### Issue: OTP not received in email

**Solution:**
1. Check spam/junk folder
2. Verify email configuration in Supabase
3. Check Supabase logs:
   - Go to **Database → Logs → OTP Table**
   - Verify OTP record created
4. Wait 1-2 minutes (email delivery has delay)
5. Request new OTP

### Issue: Database tables missing

**Solution:**
1. Verify all SQL scripts executed
2. Check for SQL errors during execution
3. Refresh table list: **Supabase → Table Editor → Refresh**
4. If tables exist but have no data, run seed script

### Issue: Port 3000 already in use

**Solution:**
\`\`\`bash
# Use different port
npm run dev -- -p 3001

# Access at http://localhost:3001
\`\`\`

### Issue: Slow localhost performance

**Solution:**
1. Clear Next.js cache:
\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

2. Check your internet connection (Supabase API calls)
3. Use Chrome DevTools to identify slow requests
4. Consider upgrading Supabase plan if API rate limited

---

## Password Reset Flow (OTP-Based)

### User-Facing Flow

1. **Forgot Password Page**
   - User enters email
   - App generates secure 6-digit OTP
   - OTP sent via email (expires in 10 minutes)

2. **Verify OTP Page**
   - User receives email with OTP
   - Enters 6-digit code
   - Auto-submits when all digits entered
   - Can resend after 60-second cooldown

3. **Reset Password Page**
   - User sets new password
   - Password strength indicator shows requirements
   - Must be 8+ characters

### Backend Security

- OTP hashed with SHA-256 before storage
- Rate limiting: max 5 attempts per OTP
- Automatic expiration: 10 minutes
- One-time use only
- Secure random generation

---

## Deployment to Vercel

### Prerequisites

- GitHub account
- Vercel account (free)
- Push code to GitHub

### Deploy

1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import GitHub repository
4. Configure environment variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-domain.com
   \`\`\`
5. Click Deploy
6. Update Supabase email redirect URL to production domain

---

## Environment Variables Checklist

- [ ] NEXT_PUBLIC_SUPABASE_URL - Project URL from Supabase
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY - Public key from Supabase
- [ ] NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL - Redirect URL (localhost:3000 for dev, domain for prod)

---

## Database Schema Summary

| Table | Purpose | Key Features |
|-------|---------|--------------|
| profiles | User profiles | XP, LifeCoins, avatar, level |
| tasks | Daily tasks/quests | Rewards, difficulty, status |
| password_reset_otp | OTP storage | Hashed code, expiration, attempts |
| posts | Social posts | Likes, comments, visibility |
| notifications | Real-time alerts | Read status, type |
| avatars | Avatar definitions | House, traits, unlock conditions |
| reflections | Mood tracking | Private, emotion, gratitude |

---

## Development Tips

### Useful Commands

\`\`\`bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Run linter
npm run lint

# Format code
npm run format
\`\`\`

### Debug OTP System

In `.env.local`, OTPs are logged to console:
\`\`\`
[v0] Generated OTP: 123456
\`\`\`

Use this for testing without waiting for email delivery.

### Database Queries

Test in Supabase SQL Editor:
\`\`\`sql
-- Check OTP attempts
SELECT email, otp_code, attempts, expires_at 
FROM password_reset_otp 
WHERE email = 'user@example.com' 
ORDER BY created_at DESC 
LIMIT 1;

-- View user profiles
SELECT id, username, level, lifecoins, streak_count FROM profiles;
\`\`\`

---

## Performance Optimization

- Next.js automatic code splitting
- Image optimization with unoptimized flag for dev
- Supabase connection pooling via SSR
- Client-side caching with SWR
- Real-time subscriptions via Supabase PostgREST

---

## Security Checklist

- ✅ All tables have RLS enabled
- ✅ OTP hashed before storage
- ✅ Password reset requires OTP verification
- ✅ API routes use server-side validation
- ✅ Environment variables never exposed
- ✅ HTTPS recommended for production

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Project Creator**: Aiza Fatima (Azauresthic)

---

## What's Next?

1. Customize avatars with your own images
2. Add more quest types
3. Implement leaderboards
4. Add push notifications
5. Create mobile app version
6. Add social sharing features

Enjoy building with Lifebook! 🚀
