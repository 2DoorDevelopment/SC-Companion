import { useState, useMemo, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { ShipCard } from './ShipCard'
import { ShipFormSheet } from './ShipFormSheet'
import { EmptyState } from './EmptyState'
import { HangarFilters } from './HangarFilters'
import type { HangarFilterState } from './HangarFilters'
import { useHangar } from '../../hooks/useHangar'
import type { AppData, Ship, ShipFormValues } from '../../lib/schema'

interface OutletCtx { data: AppData; update: (d: AppData) => void }

const DEFAULT_FILTERS: HangarFilterState = {
  search: '',
  statuses: new Set(['ready', 'in_delivery', 'destroyed'] as const),
  manufacturers: new Set<string>(),
  sort: 'name',
}

export function HangarPage() {
  const { data, update } = useOutletContext<OutletCtx>()
  const { ships, addShip, editShip, deleteShip } = useHangar({ data, update })

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Ship | undefined>()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const manufacturers = useMemo(
    () => [...new Set(ships.map((s) => s.manufacturer))].sort(),
    [ships]
  )

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase()
    return ships
      .filter((s) => {
        if (!filters.statuses.has(s.status)) return false
        if (filters.manufacturers.size > 0 && !filters.manufacturers.has(s.manufacturer)) return false
        if (q) {
          const haystack = `${s.name} ${s.model} ${s.manufacturer} ${s.location}`.toLowerCase()
          if (!haystack.includes(q)) return false
        }
        return true
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case 'model': return a.model.localeCompare(b.model)
          case 'manufacturer': return a.manufacturer.localeCompare(b.manufacturer)
          case 'status': return a.status.localeCompare(b.status)
          case 'date': return b.createdAt.localeCompare(a.createdAt)
          default: return a.name.localeCompare(b.name)
        }
      })
  }, [ships, filters])

  function openAdd() {
    setEditTarget(undefined)
    setFormOpen(true)
  }

  function openEdit(ship: Ship) {
    setEditTarget(ship)
    setFormOpen(true)
  }

  function handleSave(values: ShipFormValues) {
    if (editTarget) {
      editShip(editTarget.id, values)
    } else {
      addShip(values)
    }
  }

  function handleDelete() {
    if (editTarget) deleteShip(editTarget.id)
  }

  if (ships.length === 0) {
    return (
      <>
        <EmptyState
          onAddShip={openAdd}
          onImport={() => fileInputRef.current?.click()}
        />
        <ShipFormSheet
          open={formOpen}
          onOpenChange={setFormOpen}
          onSave={handleSave}
        />
      </>
    )
  }

  return (
    <div className="flex flex-col flex-1 relative">
      <HangarFilters
        filters={filters}
        onChange={setFilters}
        manufacturers={manufacturers}
      />

      {/* Ship grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
        {filtered.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-16 text-text-disabled text-sm font-inter">
            No ships match the current filters.
          </div>
        ) : (
          filtered.map((ship) => (
            <ShipCard key={ship.id} ship={ship} onClick={() => openEdit(ship)} />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        className="fixed bottom-6 right-4 z-20 w-14 h-14 bg-accent-cyan text-bg-void flex items-center justify-center shadow-lg shadow-accent-cyan/30 hover:bg-accent-glow transition-colors active:scale-95"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
        onClick={openAdd}
        aria-label="Add ship"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <ShipFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        ship={editTarget}
        onSave={handleSave}
        onDelete={editTarget ? handleDelete : undefined}
      />
    </div>
  )
}
