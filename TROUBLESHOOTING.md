# Lifebook - Troubleshooting Guide

## Connection Issues

### Issue: "Cannot GET http://localhost:3000"

**Symptoms:** Browser shows blank page or error

**Causes & Solutions:**

1. **Port Already in Use**
   \`\`\`bash
   # Check what's using port 3000
   lsof -i :3000
   
   # Kill the process
   lsof -ti:3000 | xargs kill -9
   
   # Restart dev server
   npm run dev
   \`\`\`

2. **Dev Server Not Started**
   \`\`\`bash
   # Start dev server
   npm run dev
   
   # Wait for message: "✓ Ready in X.Xs"
   \`\`\`

3. **Wrong URL**
   - Check: `http://localhost:3000` (not `https://`)
   - Check: Port is `3000` (not other port)
   - Check: Spelling of `localhost`

---

### Issue: "Your project's URL and Key are required"

**Symptoms:** Error on login/signup page

**Causes & Solutions:**

1. **Missing `.env.local` File**
   \`\`\`bash
   # Create in project root
   touch .env.local
   
   # Add variables (see ENV_SETUP.md)
   \`\`\`

2. **Wrong Variable Names**
   \`\`\`env
   # Check variable names are EXACTLY:
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=...
   \`\`\`

3. **Extra Spaces**
   \`\`\`env
   # WRONG (spaces around =)
   NEXT_PUBLIC_SUPABASE_URL = https://...
   
   # RIGHT (no spaces)
   NEXT_PUBLIC_SUPABASE_URL=https://...
   \`\`\`

4. **Wrong Values Copied**
   - Verify URL format: `https://xxxxx.supabase.co`
   - Not: `https://xxxxx.supabase.co/` (no trailing slash)
   - Verify anon key is complete (long string)

5. **Restart Required**
   \`\`\`bash
   # Stop dev server (Ctrl+C)
   # Then restart
   npm run dev
   \`\`\`

**Verification:**
\`\`\`bash
# Check .env.local exists
ls -la .env.local

# Check variables
cat .env.local
\`\`\`

---

## Authentication Issues

### Issue: Cannot Sign Up

**Symptoms:** Sign-up button doesn't work or gives error

**Solutions:**

1. **Check Email Format**
   - Must be valid email: `user@example.com`
   - Not: `user@` or `@example.com`

2. **Check Password Requirements**
   - Minimum 8 characters
   - Can include special characters
   - No spaces at start/end

3. **Email Already Exists**
   - Try different email
   - Or reset password if known password
   - Check spam folder for verification

4. **Check Database Connection**
   \`\`\`sql
   -- In Supabase SQL Editor
   SELECT COUNT(*) FROM auth.users;
   \`\`\`

---

### Issue: Email Verification Not Working

**Symptoms:** No email received after sign-up

**Solutions:**

1. **Check Spam Folder**
   - Look in Junk, Spam, Promotions
   - Add noreply@supabase.io to contacts

2. **Wait for Delivery**
   - Email can take 1-2 minutes
   - Check multiple times

3. **Check Supabase Settings**
   - Auth → Email → Verify enabled
   - Custom domain configured (if applicable)
   - Email provider active

4. **Resend Verification**
   - Some auth providers allow resend
   - Create new account if needed
   - Check console for errors

5. **Check Console Logs**
   - Open browser DevTools (F12)
   - Look for error messages
   - Check Network tab for API calls

---

## Password Reset Issues

### Issue: "No valid OTP session" Error

**Symptoms:** Error when trying to reset password

**Cause:** Session data lost (page refresh, navigation)

**Solutions:**

1. **Start Over**
   - Go to Forgot Password page
   - Request OTP again
   - Don't refresh during process

2. **Don't Navigate Away**
   - Stay on same page for OTP → Verify → Reset
   - Use back button if needed
   - Avoid tab switching

3. **Check Session Storage**
   \`\`\`javascript
   // In browser console
   console.log(sessionStorage.getItem('resetUserId'))
   \`\`\`

---

### Issue: OTP Email Not Received

**Symptoms:** "Check your email" but no OTP code

**Solutions:**

1. **Wait 1-2 Minutes**
   - Email delivery is asynchronous
   - Supabase email service can be slow
   - Check multiple times

2. **Check Spam Folder**
   - Add noreply@supabase.io to contacts
   - Check all email folders
   - Check promotions tab

3. **Check Email Configuration**
   - Supabase Dashboard → Auth → Email
   - Verify email is enabled
   - Check custom domain if used
   - Test with Supabase's test email

4. **Resend OTP**
   - Wait 60 seconds (cooldown)
   - Click "Didn't receive code? Resend"
   - Try with different email if problem persists

5. **Debug Mode**
   - Check browser console for logs
   - Look for `[v0]` debug statements
   - Check Network tab for API calls
   - Verify OTP generated: `[v0] Generated OTP: 123456`

---

### Issue: "Invalid OTP" After Entering Code

**Symptoms:** OTP rejected even though it seems correct

**Solutions:**

1. **Check Code Accuracy**
   - Verify all 6 digits
   - No spaces or formatting
   - Copy exactly from email
   - Don't add dashes or letters

2. **Check Expiration**
   - OTP valid for 10 minutes only
   - Check email time vs current time
   - Request new OTP if expired
   - Clock sync issue? Check device time

3. **Check Attempt Limit**
   - Max 5 attempts per OTP
   - If exceeded, request new OTP
   - Display shows remaining attempts
   - 60-second cooldown before resend

4. **Database Validation**
   \`\`\`sql
   -- Check OTP record exists and is valid
   SELECT * FROM password_reset_otp 
   WHERE email = 'your-email@example.com' 
   ORDER BY created_at DESC LIMIT 1;
   \`\`\`

5. **Clear Browser Cache**
   \`\`\`bash
   # Ctrl+Shift+Delete to open cache clear dialog
   # Clear all cookies and cache
   # Reload page
   \`\`\`

---

### Issue: Password Reset Succeeds But New Password Doesn't Work

**Symptoms:** "Success" message but can't login with new password

**Solutions:**

1. **Wait a Few Seconds**
   - Database write might be delayed
   - Automatic redirect waits 3 seconds
   - Try login again after redirect

2. **Verify New Password Entered Correctly**
   - Passwords are case-sensitive
   - Check for extra spaces
   - No special characters preventing entry

3. **Clear Authentication State**
   \`\`\`javascript
   // In browser console
   sessionStorage.clear()
   localStorage.clear()
   \`\`\`
   Then refresh and try login

4. **Check Database Update**
   \`\`\`sql
   -- Verify password was updated
   SELECT email, last_sign_in_at FROM auth.users 
   WHERE email = 'your-email@example.com';
   \`\`\`

---

## Database Issues

### Issue: "Table does not exist"

**Symptoms:** 404 error or table not found error

**Solutions:**

1. **Run Migration Scripts**
   - Open Supabase SQL Editor
   - Run scripts in order:
     1. `scripts/001-create-database-schema.sql`
     2. `scripts/002-enable-rls-policies.sql`
     3. `scripts/003-seed-avatars-and-data.sql`
     4. `scripts/005-add-otp-system.sql`

2. **Verify Tables Exist**
   - Supabase Dashboard → Table Editor
   - Refresh list (F5)
   - Look for table names
   - Verify `password_reset_otp` table exists

3. **Check for SQL Errors**
   - Look at SQL execution results
   - Check for error messages
   - Verify syntax is correct
   - Try one statement at a time

---

### Issue: RLS Policy Errors

**Symptoms:** "Row Level Security" or permission errors

**Solutions:**

1. **Verify RLS Enabled**
   \`\`\`sql
   -- Check which tables have RLS enabled
   SELECT tablename FROM pg_tables 
   WHERE schemaname = 'public';
   \`\`\`

2. **Run RLS Policy Script**
   - Execute `scripts/002-enable-rls-policies.sql`
   - This creates required policies
   - Verify completion without errors

3. **Check User Authentication**
   - User must be logged in
   - Session must be valid
   - Token must be current
   - Not expired

---

## Performance Issues

### Issue: Page Loads Very Slowly

**Symptoms:** Takes > 5 seconds to load

**Solutions:**

1. **Check Internet Connection**
   - Verify speed: speedtest.net
   - Disconnect/reconnect WiFi
   - Use wired connection if possible

2. **Check Supabase Status**
   - Visit status.supabase.com
   - Check for outages or degradation
   - Check region selection

3. **Clear Cache**
   \`\`\`bash
   # Clear Next.js cache
   rm -rf .next
   npm run dev
   \`\`\`

4. **Check Network Tab**
   - F12 → Network tab
   - Look for slow API calls
   - Check Supabase API response times
   - Look for 3xx/4xx/5xx errors

5. **Use Chrome DevTools**
   - Lighthouse audit
   - Performance tab
   - Check bottlenecks
   - Reduce unused dependencies

---

### Issue: Frequent Timeouts

**Symptoms:** "Request timeout" or "Connection refused"

**Solutions:**

1. **Check Supabase Project**
   - Supabase Dashboard
   - Verify project is active (not paused)
   - Check project status

2. **Verify Supabase URL**
   - Format: `https://xxxxx.supabase.co`
   - No typos
   - Correct project selected
   - No trailing slash

3. **Check Firewall/Network**
   - Verify outbound HTTPS allowed
   - Check corporate firewall
   - Try different network (mobile hotspot)
   - Check ISP blocks

4. **Increase Timeout**
   - Edit timeout values in API calls
   - Default usually 30 seconds
   - Business plan has better uptime

---

## Email Delivery Issues

### Issue: Emails Going to Spam

**Symptoms:** OTP arrives in spam folder consistently

**Solutions:**

1. **Add to Contacts**
   - Add noreply@supabase.io to address book
   - Mark email as "Not spam"
   - Create email filter rule

2. **Check Email Provider**
   - Gmail: Check Promotions tab
   - Outlook: Check Junk folder
   - Yahoo: Check Bulk folder
   - Apple: Check VIP List

3. **Configure SPF/DKIM**
   - Supabase Dashboard → Auth → Email
   - Set up custom domain
   - Add DNS records
   - Wait for verification

4. **Test Email Delivery**
   - Use Supabase test email
   - Check delivery logs
   - Verify email settings

---

### Issue: No OTP Code Visible in Email

**Symptoms:** Email received but no code inside

**Solutions:**

1. **Check Email Rendering**
   - Open in different client
   - Check HTML vs plain text
   - View source/raw email

2. **Check Supabase Template**
   - Auth → Email Templates
   - Verify template is correct
   - Add OTP variable if missing
   - Test send again

3. **Check Email Service**
   - Verify email not blocked
   - Check email logs
   - Try different provider
   - Contact Supabase support

---

## Development Environment

### Issue: npm install Fails

**Symptoms:** Installation error or dependency conflict

**Solutions:**

\`\`\`bash
# Clear cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install

# If still fails, try
npm install --legacy-peer-deps
\`\`\`

---

### Issue: TypeScript Errors

**Symptoms:** Red squiggles in code editor

**Solutions:**

1. **Restart Editor**
   - Close VS Code
   - Reopen project
   - Wait for TypeScript server

2. **Rebuild TypeScript**
   \`\`\`bash
   npm run build
   \`\`\`

3. **Check Configuration**
   - Verify `tsconfig.json` exists
   - Check paths configuration
   - Verify types installed

---

## Getting Help

### Debugging Steps

1. **Check Console**
   - F12 → Console tab
   - Look for red errors
   - Look for `[v0]` debug logs
   - Copy full error message

2. **Check Network**
   - F12 → Network tab
   - Look for failed requests (red)
   - Check response status
   - Look for error messages

3. **Check Supabase Logs**
   - Supabase Dashboard → Logs
   - Look for errors
   - Check query timing
   - Verify RLS policies

4. **Enable Debug Logging**
   - Browser console shows `[v0]` logs
   - Network tab shows API calls
   - Check for error codes
   - Save logs for analysis

### Resources

- **Supabase Status:** https://status.supabase.com
- **Supabase Support:** https://supabase.com/support
- **Vercel Status:** https://www.vercel.com/statuspage
- **Next.js Issues:** https://github.com/vercel/next.js/issues

### Contact Support

- **Creator:** Aiza Fatima (Azauresthic)
- **Email:** Check GitHub profile
- **GitHub Issues:** Create issue with logs

---

## Emergency Reset

If everything is broken, try this:

\`\`\`bash
# Stop dev server (Ctrl+C)

# Clear everything
rm -rf .next
rm -rf node_modules
rm package-lock.json
rm .env.local

# Reinstall
npm install

# Create .env.local with correct values
# (See ENV_SETUP.md)

# Restart
npm run dev
\`\`\`

If database is corrupted:

1. Backup current data (if possible)
2. Delete all tables
3. Run migration scripts again
4. Reseed data
5. Update .env.local if needed

---

## Performance Debugging Checklist

- [ ] Check internet connection speed
- [ ] Verify Supabase is active
- [ ] Check Supabase status page
- [ ] Clear browser cache
- [ ] Clear .next directory
- [ ] Verify environment variables
- [ ] Check Network tab for slow requests
- [ ] Review Supabase logs
- [ ] Check database query performance
- [ ] Verify RLS policies not slowing queries
- [ ] Update Node.js to latest
- [ ] Update npm packages

---

## FAQ

**Q: How long should OTP take to arrive?**
A: 1-2 minutes typically. Check spam folder if longer.

**Q: Can I change OTP length?**
A: Currently fixed at 6 digits. See OTP_PASSWORD_RESET_IMPLEMENTATION.md for future enhancements.

**Q: What if OTP expires?**
A: Request a new one. 60-second cooldown before resend.

**Q: Can I preview OTP locally?**
A: Yes, check browser console logs: `[v0] Generated OTP: 123456`

**Q: Is OTP secure?**
A: Yes. Hashed, time-limited, one-time use, rate-limited.

**Q: Works locally but not deployed?**
A: Check environment variables in Vercel dashboard.

**Q: Why does email take 2 minutes?**
A: Supabase email service is async. Depends on queue.

**Q: Can users have multiple pending OTPs?**
A: Only latest OTP is valid. Others auto-expire.

---

**Last Updated:** January 2026
**Created by:** Aiza Fatima (Azauresthic)

Lifebook - Level Up Your Real Life! 🚀
