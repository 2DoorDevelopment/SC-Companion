import { useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { Button } from '../ui/Button'
import { parseImportFile } from '../../lib/export-import'
import { exportData } from '../../lib/export-import'
import { useAppData } from '../../hooks/useAppData'
import type { AppData } from '../../lib/schema'

export function AppShell() {
  const { data, update } = useAppData()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importState, setImportState] = useState<
    { pending: AppData; shipCount: number } | null
  >(null)
  const [importError, setImportError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const result = await parseImportFile(file)
    if (!result.ok) {
      setImportError(result.error)
      return
    }
    setImportState({ pending: result.data, shipCount: result.shipCount })
  }

  function handleImportConfirm() {
    if (!importState) return
    update(importState.pending)
    setImportState(null)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-bg-void">
      <TopNav data={data} onImportClick={() => fileInputRef.current?.click()} />

      {/* Hidden file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Main content */}
      <main
        className="flex flex-col flex-1"
        style={{ paddingTop: '56px' }}
      >
        <Outlet context={{ data, update }} />
      </main>

      {/* Import confirmation */}
      <ConfirmDialog
        open={importState !== null}
        onOpenChange={(o) => !o && setImportState(null)}
        title="IMPORT DATA"
        confirmLabel="Replace & Import"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleImportConfirm}
        message={
          <>
            This will replace{' '}
            <span className="text-text-primary font-medium">
              {data.hangar.length} ship{data.hangar.length !== 1 ? 's' : ''}
            </span>{' '}
            in your current hangar with the{' '}
            <span className="text-text-primary font-medium">
              {importState?.shipCount ?? 0} ship
              {importState?.shipCount !== 1 ? 's' : ''}
            </span>{' '}
            in the import file.
          </>
        }
        extra={
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-accent-cyan"
            onClick={() => exportData(data)}
          >
            Download current data first
          </Button>
        }
      />

      {/* Import error */}
      <ConfirmDialog
        open={importError !== null}
        onOpenChange={(o) => !o && setImportError(null)}
        title="IMPORT FAILED"
        confirmLabel="OK"
        cancelLabel=""
        variant="danger"
        onConfirm={() => setImportError(null)}
        message={importError ?? ''}
      />
    </div>
  )
}
