# Lifebook - Guest Mode Edition 🎯

**No sign-up. No login. No databases needed. Just start your adventure.**

A fully-functional guest mode personal development app that combines habit tracking, task management, mood tracking, and reflection journaling. All data is stored locally on your device for complete privacy.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/aiza-aifatimas-projects/v0-lifebook-app-features)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app)
[![Guest Mode Ready](https://img.shields.io/badge/Guest%20Mode-Ready-green?style=for-the-badge)](./GUEST_MODE_QUICK_START.md)

## ✨ Key Features

### 🚀 Instant Access
- No sign-up or authentication required
- Start using the app in seconds
- Just enter your name and begin

### 💾 Local Data Storage
- All data stored in browser's localStorage
- 100% private - nothing sent to servers
- Works offline completely
- Persists across browser sessions

### 📊 Complete Feature Set
- **Tasks**: Create, track, and complete tasks with rewards
- **LifeCoins**: Earn virtual currency for achievements
- **Reflections**: Journal your thoughts, mood, and insights
- **Map**: Visual representation of your life journey
- **Boss Battles**: Progressive challenges to overcome
- **Social**: Share and view community experiences
- **Dashboard**: Overview of all your progress

### 💾 Data Management
- **Backup**: Export all data as JSON file
- **Restore**: Import previously backed-up data
- **Statistics**: Monitor storage usage and activity
- **Multi-Device**: Use backup to switch devices seamlessly

## 🚀 Quick Start

### Requirements
- Node.js 18+
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd lifebook

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

### That's it!
No database setup, no environment variables, no authentication configuration needed.

## 📁 Project Structure

```
app/
├── page.tsx                    # Landing page
├── dashboard/                  # Main dashboard
├── tasks/                      # Task management
├── reflection/                 # Reflection journal
├── map/                        # Life map visualization
├── boss-battle/                # Boss battles
├── social/                     # Social features
├── guest-profile/              # Guest profile & settings
└── profile/                    # Profile (redirects to guest)

components/
├── guest-welcome.tsx           # Landing page component
├── data-management.tsx         # Backup/restore UI
├── layout/app-header.tsx       # Navigation header
└── ... (other components)

lib/
├── guest-context.tsx          # Guest session management
├── lifecoins-context.tsx      # Currency & rewards system
├── tasks-context.tsx          # Task management
├── reflection-context.tsx     # Reflection & mood tracking
└── utils/data-export.ts       # Import/export functionality
```

## 🔄 How Guest Mode Works

### User Journey
1. User visits the app
2. Enters their name on the landing page
3. Guest session is created and stored locally
4. User is redirected to the dashboard
5. All actions automatically save to localStorage
6. Data persists across sessions and browser restarts

### Data Flow
```
User Input
    ↓
Context (state management)
    ↓
Reducer (process changes)
    ↓
useEffect (listen for changes)
    ↓
localStorage (persist data)
    ↓
On page reload → restore from localStorage
```

## 💾 LocalStorage Schema

Data is organized in localStorage with these keys:
- `lifebook_guest_session` - Guest name, ID, and settings
- `lifebook_lifecoins_state` - Currency balance and transactions
- `lifebook_tasks_state` - Tasks, quests, and completions
- `lifebook_reflection_state` - Reflections, moods, and insights
- `lifebook_boss_battle_state` - Boss battle progress

**Average Storage**: 100-300 KB per user

## 🛠 Key Changes for Guest Mode

### Enhanced Contexts
- All contexts now auto-save to localStorage
- Proper date serialization/deserialization
- Initialization from localStorage on mount
- No authentication dependencies

### New Components
- **DataManagement** - Backup, restore, and clear data
- **GuestWelcome** - Streamlined landing without auth
- **GuestProfile** - Profile page with data management

### Updated Components
- **AppHeader** - Guest menu, backup button, session reset
- **DashboardLayout** - Removed auth requirements
- **ProfilePage** - Redirects to guest profile

### Utilities
- **data-export.ts** - Import/export, backup creation, statistics

## 📖 Documentation

- **[GUEST_MODE_QUICK_START.md](./GUEST_MODE_QUICK_START.md)** - Quick setup and deployment guide
- **[GUEST_MODE_COMPLETE_GUIDE.md](./GUEST_MODE_COMPLETE_GUIDE.md)** - Comprehensive feature and technical guide

## 🎯 Features Comparison

| Feature | Guest Mode | Auth Mode* |
|---------|-----------|-----------|
| Start Time | Instant | 2-5 min (sign-up) |
| Authentication | ❌ Not needed | ✅ Required |
| Data Storage | ✅ Local | ⭕ Cloud |
| Privacy | ✅ 100% | ⭕ Depends |
| Multi-Device | ✅ Via backup | ✅ Automatic |
| Offline | ✅ Full support | ❌ Limited |
| Collaboration | ❌ Not in guest | ✅ With auth |

*Auth mode not implemented in this version

## 🧪 Testing

### Manual Testing Checklist
- [ ] Landing page loads with guest welcome
- [ ] Can enter name and start
- [ ] Data persists after refresh
- [ ] Can create and complete tasks
- [ ] LifeCoins update correctly
- [ ] Reflections save properly
- [ ] Can export data as JSON
- [ ] Can import data successfully
- [ ] Profile page shows stats
- [ ] Header menu works
- [ ] "New Session" clears guest name

### Browser Console Testing
```javascript
// View all Lifebook data
Object.keys(localStorage).filter(k => k.startsWith('lifebook_'))

// View guest session
JSON.parse(localStorage.getItem('lifebook_guest_session'))

// Check LifeCoins
JSON.parse(localStorage.getItem('lifebook_lifecoins_state')).balance
```

## 🚀 Deployment

### Deploy to Vercel
```bash
# Push to GitHub
git add .
git commit -m "Guest mode version"
git push origin main

# Deploy on vercel.com
# - Connect repository
# - No environment variables needed
# - Deploy!
```

### Deploy Elsewhere
1. Build: `npm run build`
2. Deploy the `.next/` folder
3. Works as-is, no server configuration needed

## 🔒 Privacy

- **Data**: All stored locally, never leaves your device
- **No Tracking**: No analytics, tracking, or telemetry
- **No Accounts**: No user IDs, emails, or passwords stored anywhere
- **Browser-Only**: Pure client-side application
- **Backups**: You control your backups completely

## 🎮 Features

### Task Management
- Create tasks with difficulty levels
- Earn LifeCoins on completion
- Track completion rates
- Recurring task support
- Task categories (study, fitness, money, health, social, creative)

### LifeCoins System
- Earn coins for completing tasks
- Lose coins for failures
- Streak bonuses
- Transaction history
- Level progression

### Reflection Journal
- Record daily reflections
- Mood tracking
- Energy level tracking
- Mood trends
- Weekly insights

### Quests
- Hidden quests unlock automatically
- Bonus rewards
- Streak-based milestones
- Progress tracking

### Map & Progression
- Visual journey representation
- Stats overview
- Achievement display
- Progress visualization

## 🐛 Troubleshooting

### Data Not Saving?
1. Check if browser allows localStorage
2. Try incognito/private mode
3. Check browser storage limits
4. View browser DevTools → Application → Storage

### Lost Data?
1. Check if backup exists
2. Restore from backup file
3. Check localStorage in DevTools
4. Browser clear cache might have deleted it

### Import Fails?
1. Verify JSON file is valid
2. Check file size (<5MB)
3. Try exporting test backup first
4. Check browser console for errors

## 💡 Tips

- Export your data regularly for backup
- Use browser developer tools to inspect localStorage
- Keep reflection entries under 500 for performance
- Test import/export with a sample backup
- Share the backup file to move data between devices

## 🎨 Customization

### Change App Colors
Edit `/app/globals.css` to modify CSS variables

### Update Landing Message
Edit `/components/guest-welcome.tsx` to change welcome text

### Modify Task Categories
Edit `/lib/types/database.ts` to add/remove task types

## 📞 Support

For issues or questions:
1. Check the documentation guides
2. Review browser console for errors
3. Test with different browser
4. Clear cache and try again
5. Export and re-import data

## 📝 License

Created by Aiza Fatima (Azauresthic)

## 🔗 Repository

This repository stays in sync with [v0.app](https://v0.app) deployments.

---

**Version**: Guest Mode 1.0  
**Last Updated**: 2024-02-14  
**Status**: ✅ Production Ready
