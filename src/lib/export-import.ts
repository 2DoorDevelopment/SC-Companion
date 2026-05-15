import { AppDataSchema } from './schema'
import type { AppData } from './schema'
import { runMigrations } from './migrations'

export function exportData(data: AppData): void {
  const payload: AppData = {
    ...data,
    exportedAt: new Date().toISOString(),
  }
  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const date = new Date().toISOString().slice(0, 10)
  const a = document.createElement('a')
  a.href = url
  a.download = `sc-companion-export-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export type ImportResult =
  | { ok: true; data: AppData; shipCount: number }
  | { ok: false; error: string }

export async function parseImportFile(file: File): Promise<ImportResult> {
  try {
    const text = await file.text()
    const raw = JSON.parse(text) as Record<string, unknown>
    const migrated = runMigrations(raw)
    const result = AppDataSchema.safeParse(migrated)
    if (!result.success) {
      const first = result.error.issues[0]
      return { ok: false, error: `Invalid file: ${first?.message ?? 'unknown error'}` }
    }
    return { ok: true, data: result.data, shipCount: result.data.hangar.length }
  } catch (err) {
    if (err instanceof SyntaxError) {
      return { ok: false, error: 'File is not valid JSON.' }
    }
    if (err instanceof Error && err.message.includes('newer version')) {
      return { ok: false, error: err.message }
    }
    return { ok: false, error: 'Could not read file.' }
  }
}
