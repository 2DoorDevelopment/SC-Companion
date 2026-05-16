import { useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Download, Upload, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { exportData, parseImportFile } from '../../lib/export-import'
import { hasBackup, loadBackup } from '../../lib/storage'
import type { AppData } from '../../lib/schema'

interface OutletCtx { data: AppData; update: (d: AppData) => void }

export function SettingsPage() {
  const { data, update } = useOutletContext<OutletCtx>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importPending, setImportPending] = useState<{ data: AppData; shipCount: number } | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [restoreConfirm, setRestoreConfirm] = useState(false)
  const [clearConfirm, setClearConfirm] = useState(false)

  const backup = loadBackup()
  const backupDate = backup?.meta.lastModifiedAt
    ? new Date(backup.meta.lastModifiedAt).toLocaleString()
    : null

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const result = await parseImportFile(file)
    if (!result.ok) { setImportError(result.error); return }
    setImportPending({ data: result.data, shipCount: result.shipCount })
  }

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="border border-border-subtle">
        <div className="px-4 py-2.5 border-b border-border-subtle bg-bg-elevated">
          <h2 className="font-aldrich text-xs text-text-secondary uppercase tracking-widest">
            {title}
          </h2>
        </div>
        <div className="p-4 flex flex-col gap-3">{children}</div>
      </div>
    )
  }

  function Row({ icon, label, sub, action }: { icon: React.ReactNode; label: string; sub?: string; action: React.ReactNode }) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-text-secondary flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-inter text-text-primary">{label}</div>
          {sub && <div className="text-xs font-mono text-text-disabled mt-0.5 truncate">{sub}</div>}
        </div>
        {action}
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-4 max-w-lg mx-auto w-full">
      <h1 className="font-aldrich text-lg text-text-primary uppercase tracking-widest">Settings</h1>

      <Section title="Data">
        <Row
          icon={<Download size={16} />}
          label="Export Hangar"
          sub={`${data.hangar.length} ship${data.hangar.length !== 1 ? 's' : ''}`}
          action={
            <Button variant="secondary" size="sm" onClick={() => exportData(data)}>
              Export
            </Button>
          }
        />
        <Row
          icon={<Upload size={16} />}
          label="Import JSON"
          sub="Replaces current data"
          action={
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              Import
            </Button>
          }
        />
      </Section>

      {hasBackup() && backup && (
        <Section title="Backup">
          <Row
            icon={<RotateCcw size={16} />}
            label="Restore Previous State"
            sub={backupDate ?? undefined}
            action={
              <Button variant="secondary" size="sm" onClick={() => setRestoreConfirm(true)}>
                Restore
              </Button>
            }
          />
        </Section>
      )}

      <Section title="Danger Zone">
        <Row
          icon={<Trash2 size={16} className="text-status-destroyed" />}
          label="Clear All Data"
          sub="Permanently removes everything"
          action={
            <Button variant="danger" size="sm" onClick={() => setClearConfirm(true)}>
              Clear
            </Button>
          }
        />
      </Section>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Import confirm */}
      <ConfirmDialog
        open={importPending !== null}
        onOpenChange={(o) => !o && setImportPending(null)}
        title="IMPORT DATA"
        confirmLabel="Replace & Import"
        variant="danger"
        onConfirm={() => { if (importPending) update(importPending.data) }}
        message={`This will replace ${data.hangar.length} ships with ${importPending?.shipCount ?? 0} from the import file.`}
        extra={
          <Button variant="ghost" size="sm" className="w-full text-accent-cyan" onClick={() => exportData(data)}>
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

      {/* Restore confirm */}
      <ConfirmDialog
        open={restoreConfirm}
        onOpenChange={setRestoreConfirm}
        title="RESTORE BACKUP"
        confirmLabel="Restore"
        variant="danger"
        onConfirm={() => { if (backup) update(backup) }}
        message={`Restore previous state from ${backupDate ?? 'backup'}? Current data will be overwritten.`}
      />

      {/* Clear confirm */}
      <ConfirmDialog
        open={clearConfirm}
        onOpenChange={setClearConfirm}
        title="CLEAR ALL DATA"
        confirmLabel="Clear Everything"
        variant="danger"
        onConfirm={() => {
          update({
            schemaVersion: 1,
            hangar: [],
            inventory: [],
            mining: [],
            cargo: [],
            missions: [],
            meta: { createdAt: new Date().toISOString(), lastModifiedAt: new Date().toISOString() },
          })
        }}
        message="This will permanently delete all your ships and data. This cannot be undone."
      />
    </div>
  )
}
