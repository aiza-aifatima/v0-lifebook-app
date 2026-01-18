# Lifebook Deployment Checklist

## Pre-Deployment (Local Testing)

### 1. Environment Setup
- [ ] Created `.env.local` file
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Set `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000`
- [ ] Verified no `.env.local` in git (`added to .gitignore`)

### 2. Database Setup
- [ ] Created Supabase project
- [ ] Ran `scripts/001-create-database-schema.sql`
- [ ] Ran `scripts/002-enable-rls-policies.sql`
- [ ] Ran `scripts/003-seed-avatars-and-data.sql`
- [ ] Ran `scripts/005-add-otp-system.sql`
- [ ] Verified all tables exist in Supabase
- [ ] Verified RLS policies enabled

### 3. Email Configuration
- [ ] Enabled email confirmations in Supabase Auth
- [ ] Configured email templates (or using defaults)
- [ ] Tested email delivery with test account
- [ ] Verified OTP emails received

### 4. Local Testing
- [ ] `npm install` completed
- [ ] `npm run dev` starts without errors
- [ ] Application loads at http://localhost:3000
- [ ] Welcome screen displays
- [ ] Sign-up flow works
- [ ] Email verification works
- [ ] Login flow works
- [ ] Password reset OTP flow works:
  - [ ] Request OTP
  - [ ] Receive OTP email
  - [ ] Verify OTP
  - [ ] Reset password
  - [ ] Login with new password
- [ ] Dashboard loads after login
- [ ] Avatar selection works
- [ ] Tasks can be created
- [ ] LifeCoins display correctly

### 5. Code Quality
- [ ] No console errors on page load
- [ ] No TypeScript errors
- [ ] No `console.log('[v0]...')` debug statements left
- [ ] Responsive design tested on mobile
- [ ] All links/buttons functional

---

## Pre-Deployment (Vercel Setup)

### 1. Repository Setup
- [ ] Code pushed to GitHub
- [ ] `.env.local` added to `.gitignore`
- [ ] All sensitive data removed from code
- [ ] `.git/` properly initialized

### 2. Vercel Project
- [ ] Vercel account created
- [ ] GitHub repo connected
- [ ] Project created in Vercel dashboard

---

## Deployment Steps

### 1. Add Environment Variables to Vercel
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-production-domain.com
```

- [ ] Navigate to Project Settings → Environment Variables
- [ ] Add each variable
- [ ] Ensure they're available for Production

### 2. Deploy
- [ ] Click "Deploy" in Vercel dashboard
- [ ] Wait for build to complete
- [ ] Watch for build errors in logs
- [ ] Verify deployment success

### 3. Post-Deployment Testing
- [ ] Application loads at production URL
- [ ] Welcome screen displays
- [ ] Sign-up works with new domain
- [ ] Email verification sends to production domain
- [ ] OTP password reset works
- [ ] All features functional

---

## Post-Deployment (Production)

### 1. Supabase Configuration
- [ ] Updated email templates if customized
- [ ] Verified email domain authenticated
- [ ] Set password reset redirect to production domain
- [ ] Enabled HTTPS-only connections

### 2. Security Hardening
- [ ] Reviewed all RLS policies
- [ ] Verified environment variables are secret
- [ ] Set up database backups
- [ ] Enable database versioning
- [ ] Review Supabase security settings

### 3. Monitoring
- [ ] Set up error monitoring (optional)
- [ ] Monitor Supabase database usage
- [ ] Check email delivery logs
- [ ] Monitor authentication logs
- [ ] Set up alerts for high error rates

### 4. Domain Configuration
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] DNS records pointing to Vercel
- [ ] WWW redirect configured
- [ ] Email redirect URL updated

### 5. Legal & Compliance
- [ ] Privacy Policy drafted
- [ ] Terms of Service drafted
- [ ] GDPR compliance reviewed (EU users)
- [ ] Cookie policy configured
- [ ] Data retention policy set

---

## Rollback Plan

### If Deployment Fails

1. **Check Vercel Logs:**
   - Go to Vercel dashboard
   - Navigate to Deployments
   - Check build logs for errors

2. **Common Issues & Fixes:**
   ```
   Issue: "NEXT_PUBLIC_SUPABASE_URL is required"
   Fix: Verify environment variables added correctly
   
   Issue: Database connection timeout
   Fix: Ensure Supabase project is active (not paused)
   
   Issue: Email not sending
   Fix: Check Supabase email configuration and domain auth
   ```

3. **Revert Deployment:**
   - Go to Deployments page
   - Find previous successful deployment
   - Click the deployment
   - Select "Promote to Production"

---

## Verification Checklist (After Go-Live)

### 1. User Registration
- [ ] New user can sign up
- [ ] Confirmation email received
- [ ] Email verification works
- [ ] User can log in

### 2. Authentication
- [ ] Login works
- [ ] Logout works
- [ ] Session persists across page refresh
- [ ] Unauthorized users redirected to login

### 3. Password Reset (Most Critical)
- [ ] User can request password reset
- [ ] OTP email received within 2 minutes
- [ ] OTP can be verified
- [ ] Password can be reset with OTP
- [ ] New password works for login
- [ ] Attempts limited to 5 per OTP
- [ ] OTP expires after 10 minutes

### 4. Core Features
- [ ] Avatar selection works
- [ ] LifeCoins display correctly
- [ ] Tasks can be created
- [ ] Tasks can be completed
- [ ] XP/coins awarded
- [ ] Streaks tracked
- [ ] Profile saves data

### 5. Data Persistence
- [ ] User data saved after logout/login
- [ ] Tasks persist
- [ ] Profile changes persist
- [ ] LifeCoins balance correct

### 6. Performance
- [ ] Page loads < 3 seconds
- [ ] Interactions responsive
- [ ] No timeout errors
- [ ] Database queries optimized

---

## Monitoring (Weekly)

- [ ] Check Vercel analytics
- [ ] Review Supabase logs
- [ ] Monitor error rates
- [ ] Check email delivery success
- [ ] Verify database performance
- [ ] Review user feedback

---

## Maintenance Schedule

### Daily
- Monitor error logs
- Check uptime
- Review critical alerts

### Weekly
- Review analytics
- Check database usage
- Verify email delivery
- Monitor authentication flows

### Monthly
- Backup verification
- Security audit
- Performance optimization
- User feedback review

### Quarterly
- Database optimization
- Infrastructure review
- Security penetration testing
- Feature planning

---

## Contact & Support

**Creator:** Aiza Fatima (Azauresthic)

**Critical Issues:**
1. Check error logs first
2. Review environment variables
3. Verify Supabase is active
4. Check database migrations
5. Review network connectivity

**Resources:**
- Supabase Support: https://supabase.com/support
- Vercel Docs: https://vercel.com/docs
- Next.js Issues: https://github.com/vercel/next.js/issues

---

## Success Criteria

✅ Application deployed to production
✅ All users can create accounts
✅ Password reset works reliably
✅ OTP emails deliver in < 2 minutes
✅ No critical errors in production
✅ Database responsive and secure
✅ User data properly persisted
✅ Real-time features working

**Status:** [ ] Ready for Production
