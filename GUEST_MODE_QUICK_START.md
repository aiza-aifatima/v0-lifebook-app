# Lifebook Guest Mode - Quick Start Guide

## What's Changed?

This version has been optimized for **pure guest mode** operation without any authentication:

### ✅ Features Enabled
- Instant access without sign-up
- Local data storage (no database needed)
- Auto-saving across all features
- Data export/import for backup
- Complete task & reflection management
- LifeCoins system with rewards

### ❌ Features Removed/Disabled
- Authentication (login/sign-up)
- Database requirements
- Account management
- Cloud sync (optional feature)

## Key Components Changed

### 1. **Guest Context Enhanced** ✨
```typescript
// Better session management
- Persistent guest name
- Theme preferences
- Session duration tracking
- Auto-save on every change
```

### 2. **All Contexts Now Auto-Save** 💾
```typescript
// Added to all contexts:
- localStorage initialization
- Auto-save on state changes
- Date/timestamp serialization
```

### 3. **Guest Welcome Redesigned** 🎯
```
Changes:
- Removed auth links
- Focus on guest features
- Added data privacy info
- Streamlined name entry
```

### 4. **New Guest Profile Page** 👤
```
Location: /guest-profile
Features:
- Session summary
- Activity statistics
- Data management
- Backup/restore tools
```

### 5. **Data Management Utility** 💾
```
New file: /lib/utils/data-export.ts
Functions:
- exportGuestData() - Save all data
- downloadGuestData() - Download as file
- importGuestData() - Restore from file
- handleImportFile() - UI handler
- getDataStats() - View storage
- clearAllGuestData() - Reset everything
```

### 6. **Data Management UI** 🎨
```
New component: /components/data-management.tsx
Features:
- Backup/restore interface
- Data statistics display
- Clear data option
- User-friendly dialogs
```

### 7. **App Header Updated** 🔝
```
Changes:
- Guest name display
- LifeCoins counter
- Quick menu dropdown
- Backup button
- Session reset option
```

### 8. **Dashboard Layout Simplified** 📱
```
Changes:
- Removed auth redirect
- Works with guest context
- Optional profile param
- Supports both scenarios
```

## Installation & Setup

### Prerequisites
- Node.js 18+ (already installed if using v0)
- Browser with localStorage support

### No Database Setup Required! 🎉
Unlike the original app:
- ❌ No Supabase needed
- ❌ No environment variables for auth
- ❌ No migration scripts needed
- ✅ Everything works in-browser

### Running the App

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Visit in browser
# http://localhost:3000
```

That's it! The app will work completely offline with localStorage.

## File Structure Overview

```
app/
├── page.tsx                    # Landing page → GuestWelcome
├── dashboard/
│   ├── layout.tsx             # Updated - no auth required
│   └── page.tsx               # Dashboard
├── guest-profile/
│   └── page.tsx               # NEW - Guest profile & settings
├── tasks/
│   └── page.tsx               # Task management
├── reflection/
│   └── page.tsx               # Reflection tracking
├── profile/
│   └── page.tsx               # Updated - redirects to guest-profile
└── ... (other pages)

components/
├── guest-welcome.tsx           # Updated landing
├── data-management.tsx         # NEW - backup/restore UI
└── layout/
    └── app-header.tsx          # Updated for guest mode

lib/
├── guest-context.tsx          # Enhanced with persistence
├── lifecoins-context.tsx      # Added auto-save
├── tasks-context.tsx          # Added auto-save
├── reflection-context.tsx     # Added auto-save
└── utils/
    └── data-export.ts         # NEW - import/export logic
```

## User Flow

### First Time User
```
1. Visit /
2. See GuestWelcome component
3. Enter name
4. Redirected to /dashboard
5. Guest session saved to localStorage
6. All data auto-saved as they interact
```

### Returning User
```
1. Visit /
2. Guest session loaded from localStorage
3. Auto-redirected to /dashboard
4. All data restored
5. Continue where they left off
```

### Data Management User
```
1. Visit /profile (redirects to /guest-profile)
2. See profile & statistics
3. Find "Data Management" section
4. Export/Import/Clear options available
5. Backup file downloaded to computer
```

## LocalStorage Keys Reference

Your app uses these keys:
```
lifebook_guest_session        # Session info (name, ID, theme)
lifebook_guest_id             # Session identifier
lifebook_lifecoins_state      # Currency & streak data
lifebook_tasks_state          # Tasks & quests
lifebook_reflection_state     # Reflections & moods
lifebook_boss_battle_state    # Boss battle progress
```

**Total Usage**: ~100-300 KB per typical user

## Testing Checklist

- [ ] Can enter name on landing page
- [ ] Redirects to dashboard
- [ ] Data persists after refresh
- [ ] Can create a task
- [ ] Task completion earns coins
- [ ] Can write a reflection
- [ ] Can export data as JSON
- [ ] Can import data from file
- [ ] Can view profile stats
- [ ] Menu dropdown works
- [ ] New session clears name only
- [ ] Browser storage shows keys

## Demo Data (Optional)

To add demo data, run this in browser console:

```javascript
// Demo guest session
localStorage.setItem('lifebook_guest_session', JSON.stringify({
  guestName: 'Demo User',
  guestId: 'demo_' + Date.now(),
  isAuthenticated: false,
  createdAt: new Date().toISOString(),
  theme: 'auto'
}));

// Demo LifeCoins
localStorage.setItem('lifebook_lifecoins_state', JSON.stringify({
  balance: 500,
  streak: 5,
  transactions: [],
  lastActivity: null
}));
```

Then refresh the page.

## Deployment

### To Vercel
```bash
# Push to GitHub
git add .
git commit -m "Guest mode version"
git push origin main

# Deploy on vercel.com
# - Connect your repo
# - No environment variables needed!
# - Deploy
```

### To Other Hosts
- Build: `npm run build`
- Deploy the `out/` or `.next/` folder
- No backend needed
- Works as static site

### Environment Variables
**None required!** This version is fully client-side.

## Customization

### Change App Name
Edit in:
- `/components/guest-welcome.tsx` - Line ~35
- `/components/layout/app-header.tsx` - Line ~45
- `/app/page.tsx` title

### Change Colors
Edit in:
- `/app/globals.css` - CSS variables
- `/app/guest-welcome.tsx` - Tailwind classes
- `/components/data-management.tsx` - Color utilities

### Change Guest Welcome Message
Edit `/components/guest-welcome.tsx` lines 75-85

## Troubleshooting

### "No data after refresh"
- Check browser allows localStorage
- Try incognito mode to test
- Check browser console for errors

### "Import not working"
- Verify JSON file is valid
- Check file isn't too large (>5MB)
- Try exporting a test backup first

### "LifeCoins not updating"
- Check browser DevTools → Storage
- Verify lifecoins-context loaded
- Clear localStorage and start fresh

### "Page not loading"
- Clear browser cache
- Try in different browser
- Check console for JS errors

## Next Steps

1. **Customize the appearance** - Update colors, fonts, messages
2. **Add demo data** - Seed with sample tasks/reflections
3. **Test all features** - Go through every page
4. **Deploy** - Push to Vercel or your host
5. **Share** - Give users the link!

## What About Authentication?

If you want to add auth later:
1. These guest contexts can coexist with auth
2. Add user detection in `<Providers>`
3. Route auth users to `/dashboard` (authenticated)
4. Route guests to guest features
5. Keep local-first for privacy

## Performance Tips

For better performance:
- Keep localStorage under 5MB
- Export old data periodically
- Clear old reflections/tasks
- Use browser's Storage DevTools to monitor

## Support Resources

- **Browser Console**: `console.log()` for debugging
- **Storage DevTools**: View/edit localStorage
- **JSON Validators**: Validate backup files
- **Guides**: See `/GUEST_MODE_COMPLETE_GUIDE.md`

---

## Summary

✅ **Guest Mode Ready!**
- No authentication required
- All data stored locally  
- Export/import for backup
- Deploy anywhere
- Works offline
- Privacy-focused

Start using it now with `npm run dev`!

---

**Version**: 1.0  
**Last Updated**: 2024-02-14
