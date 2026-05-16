import { AppDataSchema, CURRENT_SCHEMA_VERSION } from './schema'
import type { AppData } from './schema'
import { runMigrations } from './migrations'

const PRIMARY_KEY = 'holo-manifest:v1'
const BACKUP_KEY = 'holo-manifest:v1:backup'

function emptyAppData(): AppData {
  const now = new Date().toISOString()
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    hangar: [],
    inventory: [],
    mining: [],
    cargo: [],
    meta: { createdAt: now, lastModifiedAt: now },
  }
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(PRIMARY_KEY)
    if (!raw) return emptyAppData()

    const parsed = JSON.parse(raw) as Record<string, unknown>
    const migrated = runMigrations(parsed)
    const result = AppDataSchema.safeParse(migrated)
    if (result.success) return result.data

    console.warn('SC-Companion: stored data failed schema validation, resetting', result.error)
    return emptyAppData()
  } catch (err) {
    console.warn('SC-Companion: could not load data', err)
    return emptyAppData()
  }
}

export function saveAppData(data: AppData): void {
  const current = localStorage.getItem(PRIMARY_KEY)
  if (current) {
    localStorage.setItem(BACKUP_KEY, current)
  }
  const updated: AppData = {
    ...data,
    meta: { ...data.meta, lastModifiedAt: new Date().toISOString() },
  }
  localStorage.setItem(PRIMARY_KEY, JSON.stringify(updated))
}

export function loadBackup(): AppData | null {
  try {
    const raw = localStorage.getItem(BACKUP_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const migrated = runMigrations(parsed)
    const result = AppDataSchema.safeParse(migrated)
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export function clearAllData(): void {
  localStorage.removeItem(PRIMARY_KEY)
  localStorage.removeItem(BACKUP_KEY)
}

export function hasBackup(): boolean {
  return localStorage.getItem(BACKUP_KEY) !== null
}
