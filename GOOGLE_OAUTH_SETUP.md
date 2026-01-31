# Google OAuth Setup Guide for Lifebook

## Overview
This guide walks you through setting up Google OAuth authentication for Lifebook using Supabase. The system allows users to sign in with a single tap using their Google account, without requiring password entry.

## Prerequisites
- Supabase project (already configured)
- Google Cloud Console account (free)
- Localhost and production domain URLs ready

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Visit: https://console.cloud.google.com
2. Create a new project or select an existing one
3. Name it "Lifebook" (or your preferred name)

### 1.2 Enable Google+ API
1. Click "APIs & Services" in the left sidebar
2. Click "Enable APIs and Services"
3. Search for "Google+ API"
4. Click it and press "Enable"

### 1.3 Create OAuth 2.0 Credentials
1. Click "Credentials" in the left sidebar
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in app name: "Lifebook"
   - Add your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (your email)

### 1.4 Configure OAuth Client
1. Application type: **Web application**
2. Name: "Lifebook Web Client"
3. Authorized JavaScript origins:
   \`\`\`
   http://localhost:3000
   https://your-production-domain.com
   \`\`\`
4. Authorized redirect URIs:
   \`\`\`
   http://localhost:3000/auth/callback
   https://your-production-domain.com/auth/callback
   \`\`\`
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Supabase OAuth Provider

### 2.1 In Supabase Dashboard
1. Go to your Supabase project
2. Click "Authentication" → "Providers"
3. Find "Google" and click it
4. Enable the Google provider
5. Paste the **Client ID** from Google Cloud
6. Paste the **Client Secret** from Google Cloud
7. Save changes

### 2.2 Set Redirect URL in Supabase
1. Go to "Authentication" → "URL Configuration"
2. Set "Redirect URL" to:
   \`\`\`
   http://localhost:3000/auth/callback
   \`\`\`
   (Update for production)

## Step 3: Test the Implementation

### 3.1 Local Testing
1. Start your development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Navigate to one of these pages:
   - Sign Up: `http://localhost:3000/auth/oauth-signup`
   - Login: `http://localhost:3000/auth/login`

3. Click "Sign in with Google"

4. You should see Google's account selection screen

5. Select your Google account

6. You'll be redirected to `/auth/callback`

7. After processing, you'll be sent to `/dashboard`

### 3.2 Verify Session
Check browser DevTools Console for logs:
- `[v0] Initiating Google OAuth flow` - OAuth started
- `[v0] Processing OAuth callback` - Callback received
- `[v0] OAuth callback successful, redirecting to dashboard` - Success

## Step 4: Multiple Account Selection

Users can select from multiple Google accounts because:

1. **Google Account Selector** - When users click "Sign in with Google", Google automatically shows:
   - Available Google accounts on the device
   - Option to add a new account
   - Option to sign in with a different account

2. **No account binding** - Each Google account is treated as a separate Lifebook user

3. **First-time flow**:
   - User taps "Sign in with Google"
   - Selects their Google account from Google's selector
   - Redirected to callback
   - Their profile is created automatically in Lifebook

## Step 5: Production Deployment

### 5.1 Update URLs
1. In Google Cloud Console:
   - Add your production domain to "Authorized JavaScript origins"
   - Add your production callback URL to "Authorized redirect URIs"

2. In Supabase:
   - Update "Redirect URL" to your production domain

3. Example for production:
   \`\`\`
   Origin: https://lifebook.com
   Redirect: https://lifebook.com/auth/callback
   \`\`\`

### 5.2 Environment Variables
Ensure these are set in production:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-production-domain.com
\`\`\`

## User Flow Diagram

\`\`\`
User taps "Sign in with Google"
                ↓
    Redirected to Google OAuth screen
                ↓
    User selects Google account (multiple account support)
                ↓
    Google authenticates user
                ↓
    Redirected to /auth/callback
                ↓
    Session established with Supabase
                ↓
    User profile created/loaded
                ↓
    Redirected to /dashboard
\`\`\`

## File Structure

\`\`\`
lib/auth/
├── google-oauth.ts          # OAuth server actions
└── error-handler.ts         # Error handling

components/auth/
└── google-sign-in.tsx       # Google Sign-in button component

app/auth/
├── oauth-signup/page.tsx    # Streamlined signup page
├── login/page.tsx           # Login with Google + email option
└── callback/page.tsx        # OAuth callback handler
\`\`\`

## Troubleshooting

### Issue: "Redirect URI mismatch"
- **Solution**: Ensure the redirect URL in Supabase matches exactly:
  - Check trailing slashes
  - Verify protocol (http vs https)
  - Check domain spelling

### Issue: User sees blank page on callback
- **Solution**: Check browser console for errors
  - Verify session is established
  - Ensure `/dashboard` route exists
  - Check SUPABASE_URL and ANON_KEY are set

### Issue: "OAuth not configured"
- **Solution**: 
  - Verify Google provider is enabled in Supabase
  - Check Client ID and Client Secret are correct
  - Ensure Google+ API is enabled in Google Cloud

### Issue: Multiple accounts not appearing
- **Solution**: Users haven't logged into multiple Google accounts on their device
  - Test with multiple Google accounts
  - Clear browser cookies to reset
  - Use incognito mode for fresh session

## Security Considerations

1. **OAuth Flow** - Supabase handles all OAuth logic securely
2. **No Passwords** - Users never enter passwords in our app
3. **Tokens** - Access tokens stored securely by Supabase
4. **Session** - HTTP-only cookies for session management
5. **PKCE** - Authorization Code Flow with PKCE for extra security

## Testing Checklist

- [ ] Google OAuth credentials created in Google Cloud Console
- [ ] Google+ API enabled
- [ ] OAuth provider enabled in Supabase
- [ ] Redirect URLs configured correctly
- [ ] Local testing successful
- [ ] Multiple account selection working
- [ ] Production URLs configured
- [ ] Error handling tested
- [ ] Callback page displays correctly
- [ ] Dashboard loads after authentication

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase OAuth documentation: https://supabase.com/docs/guides/auth/oauth-2
3. Check Google Cloud documentation: https://developers.google.com/identity/oauth2
4. Review browser console logs (marked with `[v0]`)
