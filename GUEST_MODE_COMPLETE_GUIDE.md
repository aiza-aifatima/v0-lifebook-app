# Lifebook Guest Mode - Complete Guide

## Overview

This version of Lifebook is a **fully-functional guest mode application** that allows users to create, manage, and track their life goals without requiring any sign-up or authentication. All data is stored locally on the user's device, providing privacy and accessibility.

## Features

### 1. **No Authentication Required**
- Start using the app immediately after entering your name
- No email, password, or sign-up form needed
- No account management overhead

### 2. **Seamless Data Storage**
- All user data is stored in the browser's localStorage
- Data persists across browser sessions
- Each context (tasks, reflections, lifecoins) auto-saves changes

### 3. **Complete Feature Set**
- **Dashboard**: Overview of your progress and stats
- **Tasks**: Create, complete, and track tasks with rewards
- **Reflections**: Journal and track your moods and insights
- **LifeCoins**: Earn virtual currency by completing tasks
- **Map**: Visual progression through your life journey
- **Boss Battles**: Challenge yourself with progressive challenges
- **Social**: Share and view community experiences

### 4. **Data Management**
- **Backup**: Export all your data as a JSON file
- **Restore**: Import previously backed-up data
- **Statistics**: View storage usage and activity stats
- **Clear Data**: Reset everything (with confirmation)

## Architecture

### Data Contexts with Local Persistence

#### 1. **Guest Context** (`/lib/guest-context.tsx`)
- Manages guest session information
- Stores guest name, ID, creation date, and theme preference
- Auto-loads from localStorage on app start
- Auto-saves on changes

**Key Features:**
- Persistent session management
- Theme preference storage
- Session duration tracking

#### 2. **LifeCoins Context** (`/lib/lifecoins-context.tsx`)
- Manages virtual currency balance
- Tracks transactions and streaks
- Persists to localStorage

**Data Stored:**
- Current balance
- Transaction history
- Streak count and date
- Activity timestamps

#### 3. **Tasks Context** (`/lib/tasks-context.tsx`)
- Manages task creation, completion, and tracking
- Handles quest system
- Auto-saves to localStorage

**Data Stored:**
- Task list with metadata
- Quest progress
- Completion dates
- Daily statistics

#### 4. **Reflection Context** (`/lib/reflection-context.tsx`)
- Manages reflection entries and mood tracking
- Stores mood history and insights
- Auto-saves to localStorage

**Data Stored:**
- Reflection entries
- Mood snapshots
- Emotional journey data
- Weekly insights

### File Structure

```
/lib
  /utils
    data-export.ts          # Import/export functionality
  /guest-context.tsx        # Guest session management
  /lifecoins-context.tsx    # Currency management
  /tasks-context.tsx        # Task management
  /reflection-context.tsx   # Reflection management

/components
  data-management.tsx       # Data backup/restore UI
  guest-welcome.tsx         # Landing page
  /layout
    app-header.tsx          # Updated for guest mode

/app
  /guest-profile/page.tsx   # Guest profile & settings
  /dashboard/layout.tsx     # Updated for guest mode
  page.tsx                  # Landing page
```

## How It Works

### 1. **Initial Setup**
- User lands on `/` (homepage)
- Sees `GuestWelcome` component
- Enters their name and starts the adventure
- Guest session is created and saved to localStorage

### 2. **Data Persistence**
Each context has this pattern:

```typescript
// On mount: Load from localStorage
const getInitialState = () => {
  const saved = localStorage.getItem('lifebook_key')
  return saved ? JSON.parse(saved) : defaultState
}

// On change: Save to localStorage
useEffect(() => {
  localStorage.setItem('lifebook_key', JSON.stringify(state))
}, [state])
```

### 3. **Data Export/Import**
Located in `/lib/utils/data-export.ts`:
- `exportGuestData()` - Collects all localStorage data
- `downloadGuestData()` - Downloads as JSON file
- `importGuestData()` - Restores from JSON file
- `handleImportFile()` - Handles file uploads

### 4. **Guest Profile**
- New page at `/guest-profile`
- Shows stats and activity summary
- Provides data management interface
- Alternative to authenticated profile

## Usage Guide

### For First-Time Users

1. **Start Here**: Visit the home page
2. **Enter Name**: Provide your name to create a guest session
3. **Explore Dashboard**: See your stats and quick actions
4. **Create First Task**: Go to Tasks → Add Task
5. **Complete Task**: Mark task as done to earn LifeCoins
6. **Write Reflection**: Track your mood and insights
7. **Track Progress**: Watch your stats grow

### For Data Management

1. **Backup Data**:
   - Go to Profile → Data Management
   - Click "Export Data"
   - Save the JSON file somewhere safe

2. **Restore Data**:
   - Go to Profile → Data Management
   - Click "Import Data"
   - Select your previously backed-up JSON file
   - Confirm the import

3. **Switch Devices**:
   - Export data on Device A
   - Open app on Device B
   - Import the exported file
   - Your data appears instantly

### For Resetting

1. **Start New Session**:
   - Click your name/avatar in header
   - Select "New Session"
   - Confirm to clear guest session (data stays in browser)

2. **Clear All Data** (Irreversible):
   - Go to Profile → Data Management
   - Scroll to "Danger Zone"
   - Click "Clear All Data"
   - Confirm the action

## Technical Details

### LocalStorage Keys
```
lifebook_guest_session         # Guest info
lifebook_guest_id              # Session ID
lifebook_lifecoins_state       # Currency data
lifebook_tasks_state           # Tasks & quests
lifebook_reflection_state      # Reflections & moods
lifebook_boss_battle_state     # Boss battle progress
```

### Data Backup Format
The exported JSON includes:
```json
{
  "version": "1.0",
  "timestamp": "2024-02-14T10:30:00Z",
  "guestSession": {...},
  "lifecoinsState": {...},
  "tasksState": {...},
  "reflectionState": {...},
  "bossState": {...}
}
```

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (including private browsing with limitations)
- All browsers with localStorage support

### Storage Limits
- localStorage: ~5-10MB per domain
- Typical usage: 50-200KB
- Room for thousands of entries

## Features Guide

### Tasks & LifeCoins
- Complete tasks to earn LifeCoins
- Difficulty affects coin rewards (easy: 10, medium: 25, hard: 50)
- Streaks provide bonus coins
- Failed tasks incur penalties

### Reflections
- Record daily moods (happy, sad, lazy, powerful, excited, focused)
- Write insights and observations
- Track energy levels (1-10)
- View mood trends over time

### Quests
- Hidden quests unlock as you progress
- Complete challenges for big rewards
- Streak milestones trigger special quests
- Track completion status

### Dashboard
- Quick stats overview
- Recent activity
- Progress towards goals
- Upcoming tasks

## Troubleshooting

### Data Not Saving?
- Check if browser allows localStorage
- Clear cache and try again
- Export existing data before troubleshooting

### Can't Import Data?
- Ensure file is a valid JSON backup
- Check browser console for errors
- Try exporting and importing a small test

### Lost Data?
- Data persists unless you clear it
- Check localStorage in browser DevTools
- Use a backup file if available

### Performance Issues?
- Browser storing too much data
- Export data, clear, and re-import
- Limit reflection entries to ~500

## Advanced Usage

### Browser Console
Debug/view data:
```javascript
// View guest session
JSON.parse(localStorage.getItem('lifebook_guest_session'))

// View all LifeCoins transactions
JSON.parse(localStorage.getItem('lifebook_lifecoins_state')).transactions

// Check all Lifebook keys
Object.keys(localStorage).filter(k => k.startsWith('lifebook_'))
```

### Migration
To move data:
1. Export from Device A
2. Import on Device B
3. Clear Device A if needed

### Data Corruption
If data seems corrupted:
1. Export current state
2. Open browser DevTools → Storage
3. Clear affected localStorage key
4. Refresh page
5. Re-import backup if available

## Future Enhancements

Potential additions while maintaining guest-mode simplicity:
- Cloud sync option (optional)
- Multi-device awareness
- Data compression
- Offline PWA support
- Advanced analytics
- Export to CSV/PDF

## Support

For issues or questions:
- Check browser console for errors
- Verify localStorage is enabled
- Ensure JavaScript is enabled
- Try exporting/importing to test system
- Clear browser cache and try again

---

**Version**: 1.0  
**Last Updated**: 2024-02-14  
**Created by**: Aiza Fatima (Azauresthic)  

Enjoy your Lifebook journey! 🚀
