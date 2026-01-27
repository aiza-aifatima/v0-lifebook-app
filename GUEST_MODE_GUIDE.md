# Lifebook Guest Mode - Complete Guide

## Overview

Lifebook now features a **Guest Mode** that allows users to start using the app immediately with just their name, no account required. This dramatically reduces friction and encourages quick adoption.

## Key Features

### 1. **Guest Welcome Page** (`/`)
- Simple, beautiful interface asking only for user's name
- No email or password required
- Clear call-to-action: "Start Your Adventure"
- Optional account creation links visible but not forced
- Takes ~30 seconds to get into the app

### 2. **Guest Session Management**
- Local storage-based session (saved in browser)
- Unique guest ID automatically generated
- Session persists across browser refreshes
- User can return and continue where they left off

### 3. **Dashboard Integration**
- Personalized greeting: "Welcome, [Guest Name]!"
- Full access to all features (tasks, map, reflection, boss battles)
- "Create Account" and "Sign In" buttons in header
- Seamless transition to authenticated account later

### 4. **No Data Loss on Authentication**
- When guest creates account or logs in, they can retain their progress
- Progress saved locally first, synced to account on signup

## User Flow

```
Landing Page (/) 
    ↓
Guest Welcome Form
    ↓
Enter Name
    ↓
Dashboard Access (Full Features)
    ↓
[Optional] Later: Create Account or Sign In
    ↓
Account Linked with Progress
```

## Technical Implementation

### Files Created

1. **`lib/guest-context.tsx`**
   - React context managing guest session state
   - Provides `useGuest()` hook
   - Handles localStorage persistence
   - Methods: `setGuestName()`, `clearGuest()`

2. **`components/guest-welcome.tsx`**
   - Welcome component with name input form
   - Form validation (2-50 characters)
   - Error handling and feedback
   - Links to auth pages (but not required)
   - Beautiful gradient background matching brand

### Files Modified

1. **`app/layout.tsx`**
   - Added `GuestProvider` wrapper
   - Makes guest context available app-wide

2. **`app/page.tsx`**
   - Replaced welcome/login screens with `GuestWelcome`
   - Auto-redirects to dashboard if session exists

3. **`app/dashboard/page.tsx`**
   - Added guest name display in header
   - Added "Create Account" and "Sign In" buttons
   - Personalized greeting using guest name
   - Sign out option for guests

## Guest Context API

```typescript
const { guest, setGuestName, clearGuest } = useGuest()

// guest object structure:
{
  guestName: string      // User's entered name
  guestId: string        // Unique identifier
  isAuthenticated: false // Always false for guests
}

// setGuestName(name: string)
// Creates a new guest session with the given name

// clearGuest()
// Clears the guest session and localStorage
```

## Data Persistence

### Local Storage Key
- Key: `lifebook_guest`
- Value: JSON stringified guest session object
- Cleared when user signs out or creates account

### Database Integration (Future)
- When user creates account, guest data can be migrated:
  - Tasks completed as guest → User account tasks
  - Life coins earned → User account coins
  - Reflection entries → User account entries
  - Progress map → User account progress

## Security Considerations

### Current (Guest Mode)
- No sensitive data stored (just a name)
- localStorage access is browser-scoped
- Each guest gets unique ID

### When Converting to Account
- Password should be hashed with bcrypt
- Session tokens secured with HTTP-only cookies
- RLS policies enforce user data isolation
- Old guest session cleared

## Validation Rules

| Field | Validation |
|-------|-----------|
| Name | 2-50 characters, required |
| Name | Trimmed before storage |
| GuestID | Auto-generated: `guest_${timestamp}_${random}` |

## Error Handling

| Error | User Message | Action |
|-------|-------------|--------|
| Empty name | "Please enter your name" | Focus input |
| Too short | "Name must be at least 2 characters" | Show feedback |
| Too long | "Name must be less than 50 characters" | Show feedback |
| Session create fail | "Failed to start. Please try again." | Retry option |

## Migration Path: Guest → Authenticated

When user clicks "Create Account" or "Sign In":

1. **Option A: Sign Up**
   - Go to `/auth/sign-up`
   - Create account with email/password
   - Optionally link existing guest progress
   - Guest session cleared on successful signup

2. **Option B: Sign In**
   - Go to `/auth/login`
   - Sign in with existing account
   - Can start fresh or migrate guest progress
   - Guest session cleared on successful login

## User Benefits

✅ **Instant access** - No signup barriers  
✅ **Try before commit** - Use full app before account  
✅ **Progress saved** - Local storage keeps data  
✅ **Optional authentication** - Only when ready  
✅ **Personalized** - Greeted by name immediately  
✅ **Flexible** - Easy to upgrade to account  

## Developer Notes

### Adding Guest-Only Features
```typescript
import { useGuest } from '@/lib/guest-context'

function MyComponent() {
  const { guest } = useGuest()
  
  if (guest?.isAuthenticated) {
    // Show account-specific features
  } else {
    // Show guest features
  }
}
```

### Checking Authentication Status
```typescript
// Guest not authenticated
if (!guest?.isAuthenticated) {
  // Show upgrade prompt
}

// Guest is authenticated (converted to account)
if (guest?.isAuthenticated) {
  // Show account features
}
```

### Syncing Guest to Account
```typescript
// When user creates account:
1. Save guest ID in user profile metadata
2. Transfer local progress to database
3. Link guest history to user account
4. Clear guest session
```

## Testing Checklist

- [ ] Guest welcome shows on home page
- [ ] Name validation works (empty, too short, too long)
- [ ] Guest session persists on page refresh
- [ ] Dashboard shows guest name in greeting
- [ ] Create Account link works
- [ ] Sign In link works
- [ ] Sign out clears guest session
- [ ] All dashboard features work as guest
- [ ] Redirect to dashboard if session exists
- [ ] localStorage `lifebook_guest` populated correctly

## Future Enhancements

1. **Guest Analytics** - Track common drop-off points
2. **Persistent Identification** - Use fingerprinting for cookieless tracking
3. **Data Migration** - Auto-migrate on signup with progress preservation
4. **Progress Limits** - Optional limits on guest progress (e.g., 3 days trial)
5. **Social Sharing** - Share guest progress before signup
6. **Guest Invite** - Share app with friends via guest links

---

**Status**: Production Ready  
**Last Updated**: January 2025  
**Created by**: Aiza Fatima (Azauresthic)
