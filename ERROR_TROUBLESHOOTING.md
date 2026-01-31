# Authentication Error Troubleshooting Guide

## "An Unexpected Error Occurred" - Diagnosis & Solutions

### Quick Diagnosis Flowchart

\`\`\`
Error appears?
    ↓
    ├─→ Network error message? → Check internet connection
    ├─→ Invalid credentials? → Verify email/password
    ├─→ Email not confirmed? → Check email for verification link
    ├─→ Account exists? → Click "Sign in" link
    ├─→ Connection refused? → Server offline or misconfigured
    └─→ Generic error? → See detailed troubleshooting below
\`\`\`

## Common Error Scenarios

### 1. Network Connection Errors

**Symptoms:**
- "Please check your internet connection and try again"
- Connection timeout
- Failed to fetch error

**Causes:**
- User offline
- WiFi disconnected
- Firewall blocking connection
- DNS resolution failure
- Proxy misconfiguration

**Solutions:**
\`\`\`bash
# For developers - test network:
curl https://your-supabase-url.supabase.co/rest/v1/health

# For users:
1. Check internet connection
2. Try a different network (mobile hotspot)
3. Restart router
4. Disable VPN/proxy temporarily
5. Clear browser cache
\`\`\`

### 2. Invalid Credentials Error

**Symptoms:**
- "The email or password you entered is incorrect"
- Appears after entering credentials

**Causes:**
- Wrong email address
- Wrong password
- Typo in credentials
- CAPS LOCK on
- Extra spaces in input

**Solutions:**
\`\`\`
For users:
1. Double-check email spelling
2. Check CAPS LOCK status
3. Verify no extra spaces
4. Use "Forgot password?" to reset
5. Try different browser/incognito mode

For developers:
- Check email trimming in validation
- Ensure password not accidentally modified
\`\`\`

### 3. Email Not Confirmed Error

**Symptoms:**
- "Please check your email for a verification link to activate your account"
- Account created but can't log in

**Causes:**
- User hasn't clicked verification link
- Verification email went to spam
- Link expired (24 hours)
- Email service issue

**Solutions:**
\`\`\`
For users:
1. Check inbox and spam folder
2. Click verification link
3. If expired, use "Resend" button
4. Use different email if original blocked
5. Wait a few minutes for email delivery

For developers:
- Check Supabase email templates
- Verify email provider configuration
- Check email service logs
- Test with test email address
\`\`\`

### 4. Account Already Exists Error

**Symptoms:**
- "This email is already registered. Try logging in instead"
- After sign-up attempt

**Causes:**
- User already has account
- Duplicate registration attempt
- Email previously registered

**Solutions:**
\`\`\`
For users:
1. Click "Sign in" link in error message
2. Use "Forgot password?" if password unknown
3. Check alternate email addresses
4. Contact support if unsure

For developers:
- Verify database unique constraints
- Check for duplicate email entries
- Review account merge policies
\`\`\`

### 5. Session Expired Error

**Symptoms:**
- "Your session has expired. Please log in again"
- Appears after period of inactivity

**Causes:**
- Session timeout (configurable in Supabase)
- Browser cookies cleared
- Token expired
- User logged out from another device

**Solutions:**
\`\`\`
For users:
1. Click "Go to login" link
2. Re-enter credentials
3. Check browser allows cookies
4. Logout from other devices if needed

For developers:
- Verify session timeout settings
- Check token refresh logic
- Ensure middleware refreshing tokens
\`\`\`

### 6. Invalid Email Format Error

**Symptoms:**
- "Please enter a valid email address"
- Appears as you type or on submit

**Causes:**
- Missing @ symbol
- Missing domain extension
- Special characters not allowed
- Spaces in email

**Solutions:**
\`\`\`
Format requirements:
- Must include @ symbol
- Must have domain name
- Must have extension (.com, .org, etc)
- No spaces allowed
- Common format: user@example.com

Examples of valid:
✓ john.doe@company.com
✓ alice+tag@domain.co.uk
✓ user123@example.org

Examples of invalid:
✗ johndoe@domain (missing extension)
✗ john doe@domain.com (contains space)
✗ john@.com (missing domain)
\`\`\`

### 7. Weak Password Error

**Symptoms:**
- "Password must be at least 8 characters..."
- Real-time requirements checklist shown

**Causes:**
- Password too short
- Missing uppercase letter
- Missing lowercase letter
- Missing number
- Missing special character

**Solutions:**
\`\`\`
Password requirements:
✓ At least 8 characters
✓ One uppercase letter (A-Z)
✓ One lowercase letter (a-z)
✓ One number (0-9)
✓ One special character (!@#$%)

Example strong password:
✓ MyPassword123!

Weak passwords:
✗ password (no uppercase, number, special char)
✗ Pass1! (too short)
✗ PASSWORD123! (no lowercase)
\`\`\`

### 8. Server Error (500)

**Symptoms:**
- "We are experiencing technical difficulties"
- Appears consistently

**Causes:**
- Supabase service down
- Database connection issue
- Authentication service failure
- Server misconfiguration

**Solutions:**
\`\`\`
For users:
1. Try again in a few moments
2. Check Supabase status: status.supabase.io
3. Try different browser
4. Clear browser cache and cookies
5. Contact support if persists

For developers:
1. Check Supabase status page
2. Review server logs
3. Verify database connection
4. Test database directly
5. Check rate limiting

Command to test backend:
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
  https://your-project.supabase.co/rest/v1/health
\`\`\`

### 9. Rate Limiting Error

**Symptoms:**
- "You have tried too many times. Please wait a few minutes"
- Appears after multiple failed attempts

**Causes:**
- Too many login attempts
- Too many sign-up attempts
- Brute force protection triggered

**Solutions:**
\`\`\`
For users:
1. Wait 15 minutes
2. Try again from different location
3. Check for malicious activity
4. Contact support if locked out

For developers:
Configuration in Supabase:
- Rate limiting: 5 failed attempts per 5 minutes
- Lockout duration: 15 minutes
- Can be adjusted in Auth settings

Check rate limit status:
- Monitor Supabase metrics
- Review failed attempt logs
\`\`\`

### 10. CORS Error

**Symptoms:**
- Browser console shows CORS error
- Request blocked by browser

**Causes:**
- Supabase URL not in allowed origins
- Request from different domain/port
- Missing CORS headers

**Solutions:**
\`\`\`
For developers:

1. Check Supabase CORS settings:
   - Settings > API > CORS
   - Add localhost:3000 for development
   - Add production domain for production

2. Verify in browser console:
   - Open DevTools (F12)
   - Go to Console tab
   - Look for "Access-Control-Allow-Origin" errors

3. Environment variable check:
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

4. Allowed origins for development:
   - http://localhost:3000
   - http://127.0.0.1:3000
   - http://localhost:3001

5. Allowed origins for production:
   - https://yourdomain.com
   - https://www.yourdomain.com
\`\`\`

## Advanced Debugging

### Enable Browser Developer Tools

\`\`\`javascript
// In browser console:
localStorage.debug = 'supabase:*'

// Then reload page and check console for detailed logs
\`\`\`

### Check Network Requests

\`\`\`
1. Open DevTools (F12)
2. Go to Network tab
3. Attempt login/signup
4. Look for failed requests
5. Check response headers and body
6. Note status codes and error messages
\`\`\`

### Test API Directly

\`\`\`bash
# Test if Supabase is reachable:
curl https://your-project.supabase.co/rest/v1/health

# Expected response: {"message":"ok"}

# If not working, check:
- Supabase project status
- Network firewall rules
- DNS resolution
\`\`\`

## Environment Variable Checklist

**Required for authentication:**

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_key_here
\`\`\`

**Optional for password recovery:**

\`\`\`env
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

**Verification:**

\`\`\`bash
# Check if variables are set:
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# For local development, check .env.local file
cat .env.local
\`\`\`

## Support Resources

### For Users:
- Check error message and proposed action
- Visit help documentation
- Contact support with error code
- Include browser/device information

### For Developers:
- Check console logs with [v0] prefix
- Review error code in error response
- Check Supabase logs in dashboard
- Verify database schema and RLS policies
- Test with curl or Postman

## Prevention Tips

### For Users:
1. **Save password in manager** - Reduces typos
2. **Enable 2FA** - Added security when available
3. **Update browser** - Latest security patches
4. **Use strong WiFi** - Stable connection
5. **Check CAPS LOCK** - Prevents credential mistakes

### For Developers:
1. **Log all errors** - Helps with debugging
2. **Test edge cases** - Special characters, long inputs
3. **Monitor rate limits** - Detect abuse patterns
4. **Keep dependencies updated** - Security patches
5. **Test in production** - Catch environment issues early
