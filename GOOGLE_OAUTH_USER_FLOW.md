# Google OAuth User Flow - Lifebook

## Overview
This document describes the user experience when signing up and logging in with Google OAuth.

## Sign-Up Flow (Fastest Path)

### Step 1: Landing Page
User arrives at `/auth/oauth-signup` and sees:
- Lifebook logo and branding
- Large "Sign in with Google" button
- Benefits cards explaining the advantages
- Link to existing login page

**Time: 2 seconds**

### Step 2: Google Account Selection
User clicks "Sign in with Google" and is taken to Google's account selector showing:
- Available Google accounts on device
- Option to add new account
- "Use another account" option

**User action**: Select their preferred Google account
**Time: 5-10 seconds**

### Step 3: Permissions Grant
Google shows permission dialog:
- "Lifebook wants access to: email, profile information"
- User taps "Allow" or "Continue"

**Time: 2-3 seconds (may be cached if user already approved)

### Step 4: Automatic Redirect
User is automatically redirected to `/auth/callback`
- Animated loading state displays
- System creates/retrieves user session

**Time: 1-2 seconds**

### Step 5: Dashboard Access
User automatically redirected to `/dashboard`
- Profile loaded from Supabase
- User can immediately start using the app

**Total Sign-Up Time: 10-20 seconds**

---

## Login Flow (Existing Users)

### Step 1: Login Page
User navigates to `/auth/login` and sees:
- "Sign in with Google" button (prominent)
- OR "Email & Password" option for traditional login
- Link to forgot password

**User action**: Choose authentication method

### Option A: Google Sign-In
1. Click "Sign in with Google"
2. Google shows account selector (if multiple accounts available)
3. Select account
4. Redirect to callback
5. Redirect to dashboard

**Time: 5-15 seconds**

### Option B: Email & Password
1. Enter email
2. Enter password
3. Click "Sign In"
4. Redirect to dashboard

**Time: 10-20 seconds**

---

## Multiple Account Support

### How It Works

**Device Level:**
- Each Google account logged into the device can be accessed
- Users simply select different account when prompted

**Application Level:**
- Each Google account = separate Lifebook user
- No account merging
- Completely independent profiles

### Example Scenario

```
User has 2 Google accounts:
  1. john.doe@gmail.com
  2. john.doe@company.com

First Sign-In (gmail account):
  → Lifebook creates profile for john.doe@gmail.com
  → Creates all user data (profile, stats, etc.)

Later Login (company account):
  → Google shows both accounts
  → User selects john.doe@company.com
  → Lifebook creates NEW profile for this account
  → Completely separate from gmail account
```

### Switching Between Accounts

```
To switch accounts mid-session:
  1. Scroll to user menu
  2. Click "Sign Out"
  3. Go to /auth/login
  4. Click "Sign in with Google"
  5. Google shows account selector
  6. Select different account
  7. Lifebook loads that account's profile
```

---

## Mobile Experience

### iOS/Android
The flow is identical but optimized for mobile:

**Advantages:**
- Native Google account handling
- System-level account management
- Biometric authentication support (fingerprint, face)
- Account autofill capability

**Visual Adaptations:**
- Button sizes increased for touch targets
- Responsive layout on small screens
- No form fields to tap (cleaner interface)
- Faster loading due to system integration

### Deep Linking
When user taps link from email/messages on mobile:
1. App opens to designated page
2. Pre-configured deep link handled
3. User can continue OAuth flow

---

## Error Scenarios & Recovery

### Scenario 1: Network Error During Sign-In

**What User Sees:**
- Loading state continues for 30 seconds
- Then error message: "Connection failed"
- "Retry" button becomes available

**What Happens:**
- User clicks retry
- OAuth flow restarts
- User selects account again
- (Usually succeeds on retry)

### Scenario 2: Google Account Not Logged In

**What User Sees:**
- Taps "Sign in with Google"
- Redirected to Google login page
- Must enter Google credentials

**What Happens:**
- User logs into Google
- Permission granted
- Redirected back to Lifebook
- Account created/accessed

### Scenario 3: User Denies Permission

**What User Sees:**
- Permission dialog appears
- User clicks "Don't allow"
- Returned to sign-up page
- Error: "Permission required to continue"

**What Happens:**
- OAuth flow cancels
- User remains on sign-up page
- Can try again or use email/password

### Scenario 4: Account Already Exists

**What User Sees:**
- Nothing different in UI
- System detects existing account
- User automatically logged in

**What Happens:**
- Google returns account info
- Supabase finds existing user
- Session established
- Redirected to dashboard

---

## Password Recovery Flow

### For OAuth Users

Users who signed up with Google OAuth:

1. Click "Forgot password?" on login page
2. Enter email address
3. System sends password reset OTP
4. User enters OTP code
5. Sets new password
6. Can now login with email + password

**Alternative:**
- Simply sign in with Google again
- No password needed

---

## Data Security & Privacy

### What Lifebook Receives from Google
- Email address
- First name
- Last name
- Profile picture URL
- Google account ID

### What Lifebook Does NOT Receive
- Google password
- Google authentication tokens
- Other Google account data
- Browsing history
- Drive files

### How It's Stored
- Email + Google ID stored in `profiles` table
- Encrypted session tokens
- Row-level security enabled
- User can only access their own data

---

## Performance Metrics

| Metric | Target | Typical |
|--------|--------|---------|
| Sign-up time | < 20s | 12s |
| Login time | < 15s | 8s |
| Account selection | < 10s | 5s |
| OAuth redirect | < 5s | 1s |
| Session creation | < 3s | 1s |

---

## Accessibility

The OAuth flow is optimized for:

- **Keyboard Navigation**: Full keyboard support for account selection
- **Screen Readers**: Proper ARIA labels on buttons
- **High Contrast**: Works with OS-level high contrast modes
- **Text Size**: Responsive to user's preferred text size
- **Motor Control**: Large touch targets (48x48px minimum)
- **Cognitive Load**: Minimal steps, clear instructions

---

## Testing User Flows

### Test with Multiple Accounts

**Setup:**
1. Log into Gmail account 1
2. Without logging out, open new incognito window
3. Log into Gmail account 2

**Test:**
1. In account 1 window: Sign up with Google → Creates profile A
2. In account 2 window: Sign up with Google → Creates profile B
3. Go back to account 1: Sign in with Google → Loads profile A
4. Go back to account 2: Sign in with Google → Loads profile B

### Test Error Scenarios

1. **No internet**: Disconnect WiFi, try sign-in
2. **Slow connection**: Throttle to 3G in DevTools
3. **Cookie clearing**: Clear cookies between attempts
4. **Token expiry**: Wait 30+ minutes, attempt login

---

## Comparison: OAuth vs Traditional Auth

| Feature | Google OAuth | Email + Password |
|---------|-------------|-----------------|
| Setup time | 5 seconds | 30 seconds |
| Password needed | No | Yes |
| Account recovery | Instant | Email OTP |
| Multiple accounts | Easy | Manual |
| Mobile biometric | Yes | No |
| Account linking | No | N/A |
