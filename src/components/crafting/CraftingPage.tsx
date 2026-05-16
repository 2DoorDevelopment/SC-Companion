import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Hammer } from 'lucide-react'
import { CraftingCard } from './CraftingCard'
import { CraftingFormSheet } from './CraftingFormSheet'
import { useCrafting } from '../../hooks/useCrafting'
import type { AppData, CraftingProject, CraftingProjectFormValues, CraftingStatus } from '../../lib/schema'
import { cn } from '../../lib/cn'

interface OutletCtx { data: AppData; update: (d: AppData) => void }

const STATUS_FILTERS: { value: CraftingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'ALL' },
  { value: 'in_progress', label: 'IN PROGRESS' },
  { value: 'planned', label: 'PLANNED' },
  { value: 'completed', label: 'DONE' },
]

export function CraftingPage() {
  const { data, update } = useOutletContext<OutletCtx>()
  const { crafting, addProject, editProject, deleteProject } = useCrafting({ data, update })

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<CraftingProject | undefined>()
  const [statusFilter, setStatusFilter] = useState<CraftingStatus | 'all'>('all')

  const filtered = useMemo(() =>
    statusFilter === 'all'
      ? [...crafting].reverse()
      : [...crafting].filter(p => p.status === statusFilter).reverse(),
    [crafting, statusFilter]
  )

  const inProgressCount = useMemo(() => crafting.filter(p => p.status === 'in_progress').length, [crafting])
  const completedCount = useMemo(() => crafting.filter(p => p.status === 'completed').length, [crafting])

  function openAdd() { setEditTarget(undefined); setFormOpen(true) }
  function openEdit(p: CraftingProject) { setEditTarget(p); setFormOpen(true) }
  function handleSave(values: CraftingProjectFormValues) {
    if (editTarget) editProject(editTarget.id, values)
    else addProject(values)
  }

  if (crafting.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center flex-1 gap-6 p-8 text-center min-h-[60dvh]">
          <Hammer size={56} className="text-accent-cyan" strokeWidth={1} />
          <div className="flex flex-col gap-2">
            <h2 className="font-aldrich text-xl text-text-primary uppercase tracking-widest">No Projects</h2>
            <p className="text-sm text-text-secondary max-w-xs">Track crafting projects and required materials.</p>
          </div>
          <button
            className="h-12 px-6 bg-accent-cyan text-bg-void font-inter font-medium text-sm tracking-wide hover:bg-accent-glow transition-colors"
            onClick={openAdd}
          >
            NEW PROJECT
          </button>
        </div>
        <CraftingFormSheet open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} />
      </>
    )
  }

  return (
    <div className="flex flex-col flex-1 relative">
      {/* Stats + filters */}
      <div className="flex flex-col gap-2 px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-text-secondary">
            {inProgressCount} in progress · {crafting.length} total
          </span>
          <span className="text-status-ready">
            {completedCount} completed
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
            No projects with this status.
          </div>
        ) : (
          filtered.map(p => (
            <CraftingCard key={p.id} project={p} onClick={() => openEdit(p)} />
          ))
        )}
      </div>

      <button
        className="fixed right-4 z-20 w-14 h-14 bg-accent-cyan text-bg-void flex items-center justify-center shadow-lg shadow-accent-cyan/30 hover:bg-accent-glow transition-colors active:scale-95"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
        onClick={openAdd}
        aria-label="New crafting project"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <CraftingFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        project={editTarget}
        onSave={handleSave}
        onDelete={editTarget ? () => deleteProject(editTarget.id) : undefined}
      />
    </div>
  )
}
