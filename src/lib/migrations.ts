import type { AppData } from './schema'
import { CURRENT_SCHEMA_VERSION } from './schema'

// Migration scaffold — add migrate_v1_to_v2 etc. as new versions ship
type AnyData = Record<string, unknown>

function migrate_v0_to_v1(data: AnyData): AppData {
  return {
    schemaVersion: 1,
    hangar: [],
    inventory: [],
    mining: [],
    cargo: [],
    meta: {
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
    },
    ...(data as Partial<AppData>),
  }
}

const migrations: Array<(data: AnyData) => AnyData> = [
  migrate_v0_to_v1,
]

export function runMigrations(raw: AnyData): AppData {
  const version = typeof raw.schemaVersion === 'number' ? raw.schemaVersion : 0

  if (version > CURRENT_SCHEMA_VERSION) {
    throw new Error(
      `Export is from a newer version of SC-Companion (v${version}). Please update the app.`
    )
  }

  let data = raw
  for (let i = version; i < CURRENT_SCHEMA_VERSION; i++) {
    data = migrations[i](data)
  }

  return data as AppData
}
