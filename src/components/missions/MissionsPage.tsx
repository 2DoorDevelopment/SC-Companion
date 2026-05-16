import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Crosshair } from 'lucide-react'
import { MissionCard } from './MissionCard'
import { MissionFormSheet } from './MissionFormSheet'
import { useMissions } from '../../hooks/useMissions'
import type { AppData, Mission, MissionFormValues, MissionStatus } from '../../lib/schema'
import { cn } from '../../lib/cn'

interface OutletCtx { data: AppData; update: (d: AppData) => void }

const STATUS_FILTERS: { value: MissionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'ALL' },
  { value: 'active', label: 'ACTIVE' },
  { value: 'completed', label: 'DONE' },
  { value: 'failed', label: 'FAILED' },
  { value: 'abandoned', label: 'ABANDONED' },
]

export function MissionsPage() {
  const { data, update } = useOutletContext<OutletCtx>()
  const { missions, addMission, editMission, deleteMission } = useMissions({ data, update })

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Mission | undefined>()
  const [statusFilter, setStatusFilter] = useState<MissionStatus | 'all'>('all')

  const filtered = useMemo(() =>
    statusFilter === 'all'
      ? [...missions].reverse()
      : [...missions].filter(m => m.status === statusFilter).reverse(),
    [missions, statusFilter]
  )

  const totalEarned = useMemo(() =>
    missions.filter(m => m.status === 'completed').reduce((s, m) => s + m.payoutUEC, 0),
    [missions]
  )

  const activeCount = useMemo(() => missions.filter(m => m.status === 'active').length, [missions])

  function openAdd() { setEditTarget(undefined); setFormOpen(true) }
  function openEdit(m: Mission) { setEditTarget(m); setFormOpen(true) }
  function handleSave(values: MissionFormValues) {
    if (editTarget) editMission(editTarget.id, values)
    else addMission(values)
  }

  if (missions.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center flex-1 gap-6 p-8 text-center min-h-[60dvh]">
          <Crosshair size={56} className="text-accent-cyan" strokeWidth={1} />
          <div className="flex flex-col gap-2">
            <h2 className="font-aldrich text-xl text-text-primary uppercase tracking-widest">No Missions</h2>
            <p className="text-sm text-text-secondary max-w-xs">Track active contracts, bounties, and missions.</p>
          </div>
          <button
            className="h-12 px-6 bg-accent-cyan text-bg-void font-inter font-medium text-sm tracking-wide hover:bg-accent-glow transition-colors"
            onClick={openAdd}
          >
            ADD MISSION
          </button>
        </div>
        <MissionFormSheet open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} />
      </>
    )
  }

  return (
    <div className="flex flex-col flex-1 relative">
      {/* Stats + filters */}
      <div className="flex flex-col gap-2 px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-text-secondary">
            {activeCount} active · {missions.length} total
          </span>
          <span className="text-status-ready">
            +{totalEarned.toLocaleString()} UEC earned
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
            No missions with this status.
          </div>
        ) : (
          filtered.map(m => (
            <MissionCard key={m.id} mission={m} onClick={() => openEdit(m)} />
          ))
        )}
      </div>

      <button
        className="fixed right-4 z-20 w-14 h-14 bg-accent-cyan text-bg-void flex items-center justify-center shadow-lg shadow-accent-cyan/30 hover:bg-accent-glow transition-colors active:scale-95"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
        onClick={openAdd}
        aria-label="Add mission"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <MissionFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        mission={editTarget}
        onSave={handleSave}
        onDelete={editTarget ? () => deleteMission(editTarget.id) : undefined}
      />
    </div>
  )
}
