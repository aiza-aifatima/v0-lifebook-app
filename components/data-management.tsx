'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Download,
  Upload,
  Trash2,
  AlertCircle,
  HardDrive,
  FileJson,
} from 'lucide-react'
import {
  downloadGuestData,
  handleImportFile,
  getDataStats,
  clearAllGuestData,
} from '@/lib/utils/data-export'

export function DataManagement() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importMessage, setImportMessage] = useState('')
  const [stats, setStats] = useState(getDataStats())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const success = downloadGuestData()
      if (success) {
        console.log('[v0] Data exported successfully')
      }
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const result = await handleImportFile(file)
      setImportMessage(result.message)
      if (result.success) {
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    } finally {
      setIsImporting(false)
      e.target.value = '' // Reset file input
    }
  }

  const handleClearData = () => {
    if (clearAllGuestData()) {
      setStats(getDataStats())
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6">
      {/* Data Overview Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <HardDrive className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">Your Local Data</h3>
            {stats && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Tasks Created</p>
                  <p className="font-bold text-lg text-foreground">{stats.tasks}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reflections</p>
                  <p className="font-bold text-lg text-foreground">{stats.reflections}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">LifeCoins</p>
                  <p className="font-bold text-lg text-foreground">{stats.lifecoins}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Storage Used</p>
                  <p className="font-bold text-lg text-foreground">{stats.storageUsed} KB</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Data */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-2">Backup Data</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Download all your data as a JSON file for safekeeping
              </p>
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Import Data */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-2">Restore Data</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Import a previously backed up data file
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                onClick={handleImportClick}
                disabled={isImporting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isImporting ? 'Importing...' : 'Import Data'}
              </Button>
              {importMessage && (
                <p className="text-sm mt-2 text-blue-600">{importMessage}</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Clear Data Card */}
      <Card className="p-6 border-red-500/20 bg-red-500/5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-2">Danger Zone</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete all your data. This action cannot be undone.
            </p>
            <Button
              onClick={handleClearData}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Clear All Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Info Section */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <FileJson className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-semibold mb-1">How Backups Work</p>
            <p>
              Your backup file contains all your tasks, reflections, LifeCoins, and progress.
              You can restore it anytime on any device. We recommend backing up regularly.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
