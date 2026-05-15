import { useState, useCallback } from 'react'
import { loadAppData, saveAppData, loadBackup, clearAllData } from '../lib/storage'
import type { AppData } from '../lib/schema'

export function useAppData() {
  const [data, setData] = useState<AppData>(() => loadAppData())

  const update = useCallback((next: AppData) => {
    saveAppData(next)
    setData(next)
  }, [])

  const restoreBackup = useCallback(() => {
    const backup = loadBackup()
    if (backup) {
      saveAppData(backup)
      setData(backup)
      return true
    }
    return false
  }, [])

  const clearAll = useCallback(() => {
    clearAllData()
    setData(loadAppData())
  }, [])

  return { data, update, restoreBackup, clearAll }
}
