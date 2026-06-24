/**
 * Data Export/Import Utility for Guest Mode
 * Allows users to backup and restore their local data
 */

export interface GuestDataBackup {
  version: string
  timestamp: string
  guestSession: any
  lifecoinsState: any
  tasksState: any
  reflectionState: any
  bossState: any
}

/**
 * Export all guest data to a JSON file
 */
export function exportGuestData(): GuestDataBackup | null {
  if (typeof window === 'undefined') return null

  try {
    const backup: GuestDataBackup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      guestSession: JSON.parse(localStorage.getItem('lifebook_guest_session') || '{}'),
      lifecoinsState: JSON.parse(localStorage.getItem('lifebook_lifecoins_state') || '{}'),
      tasksState: JSON.parse(localStorage.getItem('lifebook_tasks_state') || '{}'),
      reflectionState: JSON.parse(localStorage.getItem('lifebook_reflection_state') || '{}'),
      bossState: JSON.parse(localStorage.getItem('lifebook_boss_battle_state') || '{}'),
    }
    return backup
  } catch (error) {
    console.error('[v0] Error exporting data:', error)
    return null
  }
}

/**
 * Download guest data as a JSON file
 */
export function downloadGuestData(filename?: string): boolean {
  const backup = exportGuestData()
  if (!backup) return false

  try {
    const dataStr = JSON.stringify(backup, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `lifebook-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    return true
  } catch (error) {
    console.error('[v0] Error downloading data:', error)
    return false
  }
}

/**
 * Import guest data from a JSON file
 */
export function importGuestData(backup: GuestDataBackup): { success: boolean; message: string } {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Cannot import in server context' }
  }

  try {
    if (!backup.version) {
      return { success: false, message: 'Invalid backup file format' }
    }

    // Validate backup structure
    if (
      !backup.guestSession ||
      !backup.lifecoinsState ||
      !backup.tasksState ||
      !backup.reflectionState
    ) {
      return { success: false, message: 'Backup file is incomplete or corrupted' }
    }

    // Confirm before overwriting
    const confirmed = confirm(
      'This will replace your current data with the backup. Continue?'
    )
    if (!confirmed) {
      return { success: false, message: 'Import cancelled by user' }
    }

    // Clear existing data
    localStorage.removeItem('lifebook_guest_session')
    localStorage.removeItem('lifebook_lifecoins_state')
    localStorage.removeItem('lifebook_tasks_state')
    localStorage.removeItem('lifebook_reflection_state')
    localStorage.removeItem('lifebook_boss_battle_state')

    // Import new data
    localStorage.setItem('lifebook_guest_session', JSON.stringify(backup.guestSession))
    localStorage.setItem('lifebook_lifecoins_state', JSON.stringify(backup.lifecoinsState))
    localStorage.setItem('lifebook_tasks_state', JSON.stringify(backup.tasksState))
    localStorage.setItem('lifebook_reflection_state', JSON.stringify(backup.reflectionState))
    if (backup.bossState) {
      localStorage.setItem('lifebook_boss_battle_state', JSON.stringify(backup.bossState))
    }

    console.log('[v0] Data imported successfully')
    return { success: true, message: 'Data imported successfully! Refreshing...' }
  } catch (error) {
    console.error('[v0] Error importing data:', error)
    return { success: false, message: 'Failed to import data. Please try again.' }
  }
}

/**
 * Get backup file from user input
 */
export function handleImportFile(file: File): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string) as GuestDataBackup
        const result = importGuestData(backup)
        if (result.success) {
          window.location.reload()
        }
        resolve(result)
      } catch (error) {
        console.error('[v0] Error reading file:', error)
        resolve({ success: false, message: 'Invalid file format' })
      }
    }
    reader.onerror = () => {
      resolve({ success: false, message: 'Failed to read file' })
    }
    reader.readAsText(file)
  })
}

/**
 * Get data usage statistics
 */
export function getDataStats() {
  if (typeof window === 'undefined') return null

  const stats = {
    tasks: 0,
    reflections: 0,
    lifecoins: 0,
    storageUsed: 0,
  }

  try {
    const tasksState = JSON.parse(localStorage.getItem('lifebook_tasks_state') || '{}')
    const reflectionState = JSON.parse(localStorage.getItem('lifebook_reflection_state') || '{}')
    const lifecoinsState = JSON.parse(localStorage.getItem('lifebook_lifecoins_state') || '{}')

    stats.tasks = tasksState.tasks?.length || 0
    stats.reflections = reflectionState.entries?.length || 0
    stats.lifecoins = lifecoinsState.balance || 0

    // Calculate approximate storage used
    let totalSize = 0
    for (let key in localStorage) {
      if (key.startsWith('lifebook_')) {
        totalSize += localStorage[key].length * 2 // 2 bytes per character
      }
    }
    stats.storageUsed = Math.round(totalSize / 1024) // in KB

    return stats
  } catch (error) {
    console.error('[v0] Error calculating stats:', error)
    return stats
  }
}

/**
 * Clear all guest data (with confirmation)
 */
export function clearAllGuestData(): boolean {
  if (typeof window === 'undefined') return false

  const confirmed = confirm(
    'This will permanently delete all your data. This action cannot be undone. Continue?'
  )
  if (!confirmed) return false

  try {
    const keysToRemove = [
      'lifebook_guest_session',
      'lifebook_guest_id',
      'lifebook_lifecoins_state',
      'lifebook_tasks_state',
      'lifebook_reflection_state',
      'lifebook_boss_battle_state',
    ]

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
    })

    console.log('[v0] All guest data cleared')
    return true
  } catch (error) {
    console.error('[v0] Error clearing data:', error)
    return false
  }
}
