import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Pickaxe } from 'lucide-react'
import { MiningRunCard } from './MiningRunCard'
import { MiningRunFormSheet } from './MiningRunFormSheet'
import { useMining } from '../../hooks/useMining'
import type { AppData, MiningRun, MiningRunFormValues, MiningStatus } from '../../lib/schema'
import { cn } from '../../lib/cn'

interface OutletCtx { data: AppData; update: (d: AppData) => void }

const STATUS_FILTERS: { value: MiningStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'ALL' },
  { value: 'raw', label: 'RAW' },
  { value: 'refining', label: 'REFINING' },
  { value: 'ready', label: 'READY' },
  { value: 'collected', label: 'COLLECTED' },
]

export function MiningPage() {
  const { data, update } = useOutletContext<OutletCtx>()
  const { runs, addRun, editRun, deleteRun } = useMining({ data, update })

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<MiningRun | undefined>()
  const [statusFilter, setStatusFilter] = useState<MiningStatus | 'all'>('all')

  const filtered = useMemo(() =>
    statusFilter === 'all' ? [...runs].reverse() : [...runs].filter(r => r.status === statusFilter).reverse(),
    [runs, statusFilter]
  )

  const totalSCU = useMemo(() =>
    runs.reduce((s, r) => s + r.minerals.reduce((ms, m) => ms + m.quantitySCU, 0), 0),
    [runs]
  )

  const pendingSCU = useMemo(() =>
    runs.filter(r => r.status === 'refining' || r.status === 'ready')
      .reduce((s, r) => s + r.minerals.reduce((ms, m) => ms + m.quantitySCU, 0), 0),
    [runs]
  )

  function openAdd() { setEditTarget(undefined); setFormOpen(true) }
  function openEdit(run: MiningRun) { setEditTarget(run); setFormOpen(true) }
  function handleSave(values: MiningRunFormValues) {
    if (editTarget) editRun(editTarget.id, values)
    else addRun(values)
  }

  if (runs.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center flex-1 gap-6 p-8 text-center min-h-[60dvh]">
          <Pickaxe size={56} className="text-accent-cyan" strokeWidth={1} />
          <div className="flex flex-col gap-2">
            <h2 className="font-aldrich text-xl text-text-primary uppercase tracking-widest">No Mining Runs</h2>
            <p className="text-sm text-text-secondary max-w-xs">Log your mining sessions and track refinery runs from raw to collected.</p>
          </div>
          <button
            className="h-12 px-6 bg-accent-cyan text-bg-void font-inter font-medium text-sm tracking-wide hover:bg-accent-glow transition-colors"
            onClick={openAdd}
          >
            LOG RUN
          </button>
        </div>
        <MiningRunFormSheet open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} />
      </>
    )
  }

  return (
    <div className="flex flex-col flex-1 relative">
      {/* Stats + filters */}
      <div className="flex flex-col gap-2 px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center justify-between text-xs font-mono text-text-secondary">
          <span>{runs.length} run{runs.length !== 1 ? 's' : ''} · {totalSCU.toFixed(1)} SCU total</span>
          {pendingSCU > 0 && <span className="text-status-delivery">{pendingSCU.toFixed(1)} SCU pending</span>}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              className={cn(
                'flex-shrink-0 h-7 px-2.5 text-[10px] font-mono tracking-wider border transition-colors',
                statusFilter === value
                  ? 'border-accent-cyan text-accent-cyan bg-accent-cyan/10'
                  : 'border-border-subtle text-text-secondary hover:border-border-active'
              )}
              onClick={() => setStatusFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
        {filtered.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-16 text-text-disabled text-sm font-inter">
            No runs with this status.
          </div>
        ) : (
          filtered.map((run) => (
            <MiningRunCard key={run.id} run={run} onClick={() => openEdit(run)} />
          ))
        )}
      </div>

      <button
        className="fixed bottom-6 right-4 z-20 w-14 h-14 bg-accent-cyan text-bg-void flex items-center justify-center shadow-lg shadow-accent-cyan/30 hover:bg-accent-glow transition-colors active:scale-95"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
        onClick={openAdd}
        aria-label="Log mining run"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <MiningRunFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        run={editTarget}
        onSave={handleSave}
        onDelete={editTarget ? () => deleteRun(editTarget.id) : undefined}
      />
    </div>
  )
}
