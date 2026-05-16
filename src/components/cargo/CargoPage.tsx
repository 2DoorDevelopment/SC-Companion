import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, TrendingUp } from 'lucide-react'
import { CargoEntryCard } from './CargoEntryCard'
import { CargoEntryFormSheet } from './CargoEntryFormSheet'
import { useCargo } from '../../hooks/useCargo'
import { cargoProfit } from '../../lib/schema'
import type { AppData, CargoEntry, CargoEntryFormValues, CargoStatus } from '../../lib/schema'
import { cn } from '../../lib/cn'

interface OutletCtx { data: AppData; update: (d: AppData) => void }

const STATUS_FILTERS: { value: CargoStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'ALL' },
  { value: 'bought', label: 'IN HOLD' },
  { value: 'sold', label: 'SOLD' },
]

export function CargoPage() {
  const { data, update } = useOutletContext<OutletCtx>()
  const { entries, addEntry, editEntry, deleteEntry } = useCargo({ data, update })

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<CargoEntry | undefined>()
  const [statusFilter, setStatusFilter] = useState<CargoStatus | 'all'>('all')

  const filtered = useMemo(() =>
    statusFilter === 'all' ? [...entries].reverse() : [...entries].filter(e => e.status === statusFilter).reverse(),
    [entries, statusFilter]
  )

  const totalProfit = useMemo(() =>
    entries.reduce((sum, e) => sum + (cargoProfit(e) ?? 0), 0),
    [entries]
  )

  const inHoldSCU = useMemo(() =>
    entries.filter(e => e.status === 'bought').reduce((s, e) => s + e.quantitySCU, 0),
    [entries]
  )

  function openAdd() { setEditTarget(undefined); setFormOpen(true) }
  function openEdit(e: CargoEntry) { setEditTarget(e); setFormOpen(true) }
  function handleSave(values: CargoEntryFormValues) {
    if (editTarget) editEntry(editTarget.id, values)
    else addEntry(values)
  }

  if (entries.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center flex-1 gap-6 p-8 text-center min-h-[60dvh]">
          <TrendingUp size={56} className="text-accent-cyan" strokeWidth={1} />
          <div className="flex flex-col gap-2">
            <h2 className="font-aldrich text-xl text-text-primary uppercase tracking-widest">No Trade Runs</h2>
            <p className="text-sm text-text-secondary max-w-xs">Log your cargo runs to track routes and total profit.</p>
          </div>
          <button className="h-12 px-6 bg-accent-cyan text-bg-void font-inter font-medium text-sm tracking-wide hover:bg-accent-glow transition-colors" onClick={openAdd}>
            LOG RUN
          </button>
        </div>
        <CargoEntryFormSheet open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} />
      </>
    )
  }

  return (
    <div className="flex flex-col flex-1 relative">
      {/* Stats + filters */}
      <div className="flex flex-col gap-2 px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-text-secondary">{entries.length} run{entries.length !== 1 ? 's' : ''}{inHoldSCU > 0 && ` · ${inHoldSCU} SCU in hold`}</span>
          <span className={totalProfit >= 0 ? 'text-status-ready' : 'text-status-destroyed'}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString()} UEC
          </span>
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
          filtered.map((e) => (
            <CargoEntryCard key={e.id} entry={e} onClick={() => openEdit(e)} />
          ))
        )}
      </div>

      <button
        className="fixed bottom-6 right-4 z-20 w-14 h-14 bg-accent-cyan text-bg-void flex items-center justify-center shadow-lg shadow-accent-cyan/30 hover:bg-accent-glow transition-colors active:scale-95"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
        onClick={openAdd}
        aria-label="Log cargo run"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <CargoEntryFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        entry={editTarget}
        onSave={handleSave}
        onDelete={editTarget ? () => deleteEntry(editTarget.id) : undefined}
      />
    </div>
  )
}
