# Google OAuth Deployment Guide

## Quick Deployment Checklist

### Pre-Deployment (Local Testing)
- [ ] Google Cloud Console project created
- [ ] OAuth credentials generated (Client ID + Secret)
- [ ] Google+ API enabled
- [ ] Local testing successful
- [ ] Multiple account selection verified
- [ ] Error scenarios tested
- [ ] All logs in console working
- [ ] No sensitive data in code

### Supabase Configuration
- [ ] Google provider enabled in Supabase
- [ ] Client ID entered correctly
- [ ] Client Secret entered correctly
- [ ] Redirect URL configured
- [ ] Test email added to Google consent screen

### Production URLs
- [ ] Production domain registered
- [ ] SSL certificate installed
- [ ] Domain added to Google OAuth origins
- [ ] Callback URL added to Google OAuth URIs
- [ ] Supabase redirect URL updated

### Deployment
- [ ] Code pushed to production branch
- [ ] Environment variables set in deployment platform
- [ ] Build successful
- [ ] No console errors
- [ ] OAuth flow tested in production

---

## Step-by-Step Deployment

### 1. Prepare Production URLs

**Example:**
\`\`\`
Domain: lifebook.com
Origins: https://lifebook.com
Callback: https://lifebook.com/auth/callback
\`\`\`

### 2. Update Google Cloud Console

1. Go to Google Cloud Console → Credentials
2. Select your OAuth 2.0 Client ID
3. Edit authorized origins:
   \`\`\`
   https://lifebook.com
   \`\`\`
4. Edit authorized redirect URIs:
   \`\`\`
   https://lifebook.com/auth/callback
   \`\`\`
5. Save

### 3. Update Supabase Settings

1. Supabase Dashboard → Authentication → URL Configuration
2. Update "Redirect URL":
   \`\`\`
   https://lifebook.com/auth/callback
   \`\`\`
3. Save

### 4. Set Environment Variables

In your deployment platform (Vercel, Netlify, etc.):

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://lifebook.com
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
SUPABASE_URL=<your_supabase_url>
\`\`\`

### 5. Deploy Application

\`\`\`bash
# Build
npm run build

# Deploy to production
git push production main

# Or with Vercel CLI
vercel --prod
\`\`\`

### 6. Test in Production

1. Navigate to: `https://lifebook.com/auth/oauth-signup`
2. Click "Sign in with Google"
3. Select Google account
4. Verify redirect to dashboard
5. Check session in database

---

## Staging Environment Setup

### Create Staging OAuth Credentials

1. Google Cloud Console
2. Create new OAuth Client (staging)
3. Configure for staging domain:
   \`\`\`
   https://staging.lifebook.com
   https://staging-lifebook.vercel.app
   \`\`\`

### Staging Supabase Configuration

Option A: Same Supabase project
- Update redirect URL to staging domain
- Update between staging and production deploys
- Simpler but requires manual updates

Option B: Separate Supabase project
- Create separate staging project
- Independent credentials
- No need to update between deploys
- Better for testing

**Recommended: Option B**

---

## Monitoring & Debugging

### Server Logs

Monitor these patterns in production logs:

\`\`\`
[v0] Initiating Google OAuth flow          → User started OAuth
[v0] Processing OAuth callback             → Callback received
[v0] OAuth callback successful             → Success
[v0] Google OAuth error                    → Error occurred
[v0] Network error detected                → Connection issue
\`\`\`

### User Feedback

Watch for issues:
- "Sign in with Google button not working"
- "Account selection not appearing"
- "Stuck on loading page"
- "Redirected back to signup"

### Analytics

Track these metrics:
- OAuth sign-up rate
- OAuth login rate
- Drop-off at account selection
- Drop-off at callback
- OAuth error rate

---

## Rollback Plan

### If OAuth Issues Occur

**Immediate Actions:**
1. Disable Google provider in Supabase
   - Users fall back to email/password
   - Sign-up page shows email option

2. Revert code to previous version
   \`\`\`bash
   git revert <commit_hash>
   git push production main
   \`\`\`

3. Notify users
   - Email: "Sign in with Google temporarily unavailable"
   - In-app banner: "Using email login for now"

**Fix Issues:**
1. Identify root cause in logs
2. Fix locally
3. Test thoroughly
4. Redeploy

**Re-enable:**
1. Re-enable Google provider in Supabase
2. Announce in-app: "Google sign-in restored"
3. Monitor for issues

---

## Common Production Issues

### Issue: "Redirect URI mismatch" Error

**Cause:** URL mismatch between Google Console and Supabase

**Fix:**
\`\`\`
1. Check exact URL in error
2. Go to Google Cloud Console
3. Find exact URL in authorized URIs
4. Match spacing, protocol, domain exactly
5. Save and test
\`\`\`

**Example Debugging:**
\`\`\`
Error shows: https://lifebook.com/auth/callback?code=xxx
Registered: https://lifebook.com/auth/callback

✓ Match - working
\`\`\`

### Issue: Callback Page Stuck on Loading

**Cause:** Session not created or dashboard route missing

**Fix:**
\`\`\`javascript
// In app/auth/callback/page.tsx
// Check:
1. Supabase client initialized
2. Session retrieved correctly
3. Dashboard route exists at /dashboard
4. No infinite redirect loops
\`\`\`

### Issue: Multiple Account Selection Not Appearing

**Cause:** User has only one Google account or cleared cookies

**Fix:**
\`\`\`
1. Ask user if multiple Google accounts setup
2. Have them log into second account first
3. Clear browser cookies
4. Use incognito window
\`\`\`

### Issue: CORS Error

**Cause:** Domain not in Google OAuth configuration

**Fix:**
\`\`\`
1. Check browser console for exact domain
2. Go to Google Cloud Console
3. Add domain to authorized origins
4. Add callback URL to authorized URIs
5. Wait 5-10 minutes for propagation
\`\`\`

---

## Performance Optimization

### Reduce OAuth Latency

1. **Cache Google Client Library**
   \`\`\`javascript
   // Already optimized in components/auth/google-sign-in.tsx
   \`\`\`

2. **Prefetch OAuth Endpoint**
   \`\`\`html
   <link rel="dns-prefetch" href="https://accounts.google.com" />
   \`\`\`

3. **Preload Callback Page**
   - Server-side prepare dashboard
   - Faster load time after redirect

### Monitor Performance

\`\`\`javascript
// Add to callback/page.tsx
const startTime = performance.now()
// ... OAuth processing
const duration = performance.now() - startTime
console.log(`[v0] OAuth processing took ${duration}ms`)
\`\`\`

---

## Security Audit Checklist

- [ ] No hardcoded Client Secret in code
- [ ] All secrets in environment variables
- [ ] HTTPS enforced (no HTTP)
- [ ] Supabase RLS policies enabled
- [ ] Session tokens not logged
- [ ] User ID verification on callback
- [ ] Rate limiting on callback endpoint
- [ ] CSRF protection enabled
- [ ] No redirect URL injection possible
- [ ] Error messages don't expose sensitive data

---

## Backup & Recovery

### Database Backup

Before deploying OAuth changes:
\`\`\`bash
# Supabase dashboard → Database → Backups
# Take manual backup
# Name: "Pre-OAuth-Migration"
\`\`\`

### Session Management

If users need to re-authenticate:
1. Clear all active sessions
   \`\`\`sql
   -- Supabase SQL
   DELETE FROM sessions WHERE created_at < now() - interval '24 hours'
   \`\`\`

2. Users will need to sign in again
3. Use staged rollout to minimize impact

---

## Success Criteria

OAuth deployment is successful when:

- [ ] 98%+ of OAuth attempts succeed
- [ ] < 2% drop-off at account selection
- [ ] < 3% drop-off at callback
- [ ] Avg OAuth time < 15 seconds
- [ ] No CORS errors in console
- [ ] No session creation failures
- [ ] Users report smooth experience
- [ ] Multiple account selection works
- [ ] Mobile experience smooth
- [ ] Error recovery working
