import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Search, Package } from 'lucide-react'
import { ItemCard } from './ItemCard'
import { ItemFormSheet } from './ItemFormSheet'
import { useInventory } from '../../hooks/useInventory'
import { CATEGORY_LABELS } from '../../lib/schema'
import type { AppData, InventoryItem, InventoryItemFormValues, ItemCategory } from '../../lib/schema'
import { cn } from '../../lib/cn'

interface OutletCtx { data: AppData; update: (d: AppData) => void }

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as ItemCategory[]

export function InventoryPage() {
  const { data, update } = useOutletContext<OutletCtx>()
  const { items, addItem, editItem, deleteItem } = useInventory({ data, update })

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<InventoryItem | undefined>()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'all'>('all')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
      if (q) {
        const hay = `${item.name} ${item.location ?? ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [items, search, categoryFilter])

  const totalValue = useMemo(
    () => items.reduce((sum, i) => sum + (i.priceUEC ?? 0) * i.quantity, 0),
    [items]
  )

  function openAdd() { setEditTarget(undefined); setFormOpen(true) }
  function openEdit(item: InventoryItem) { setEditTarget(item); setFormOpen(true) }
  function handleSave(values: InventoryItemFormValues) {
    if (editTarget) editItem(editTarget.id, values)
    else addItem(values)
  }

  if (items.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center flex-1 gap-6 p-8 text-center min-h-[60dvh]">
          <Package size={56} className="text-accent-cyan" strokeWidth={1} />
          <div className="flex flex-col gap-2">
            <h2 className="font-aldrich text-xl text-text-primary uppercase tracking-widest">No Items</h2>
            <p className="text-sm text-text-secondary max-w-xs">Track your weapons, armor, components, and resources.</p>
          </div>
          <button
            className="h-12 px-6 bg-accent-cyan text-bg-void font-inter font-medium text-sm tracking-wide hover:bg-accent-glow transition-colors"
            onClick={openAdd}
          >
            ADD ITEM
          </button>
        </div>
        <ItemFormSheet open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} />
      </>
    )
  }

  return (
    <div className="flex flex-col flex-1 relative">
      {/* Filters */}
      <div className="flex flex-col gap-2 px-4 py-3 border-b border-border-subtle">
        {/* Summary */}
        <div className="flex items-center justify-between text-xs font-mono text-text-secondary">
          <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
          {totalValue > 0 && <span>{totalValue.toLocaleString()} UEC total</span>}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled pointer-events-none" />
          <input
            type="search"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-8 pr-3 bg-bg-elevated border border-border-subtle text-text-primary text-sm font-inter placeholder:text-text-disabled focus:outline-none focus:border-accent-cyan"
          />
        </div>

        {/* Category chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            className={cn(
              'flex-shrink-0 h-7 px-2.5 text-[10px] font-inter tracking-wider border transition-colors',
              categoryFilter === 'all'
                ? 'border-accent-cyan text-accent-cyan bg-accent-cyan/10'
                : 'border-border-subtle text-text-secondary hover:border-border-active'
            )}
            onClick={() => setCategoryFilter('all')}
          >
            ALL
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={cn(
                'flex-shrink-0 h-7 px-2.5 text-[10px] font-inter tracking-wider border transition-colors uppercase',
                categoryFilter === cat
                  ? 'border-accent-cyan text-accent-cyan bg-accent-cyan/10'
                  : 'border-border-subtle text-text-secondary hover:border-border-active'
              )}
              onClick={() => setCategoryFilter(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
        {filtered.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-16 text-text-disabled text-sm font-inter">
            No items match the current filters.
          </div>
        ) : (
          filtered.map((item) => (
            <ItemCard key={item.id} item={item} onClick={() => openEdit(item)} />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        className="fixed bottom-6 right-4 z-20 w-14 h-14 bg-accent-cyan text-bg-void flex items-center justify-center shadow-lg shadow-accent-cyan/30 hover:bg-accent-glow transition-colors active:scale-95"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
        onClick={openAdd}
        aria-label="Add item"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <ItemFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editTarget}
        onSave={handleSave}
        onDelete={editTarget ? () => deleteItem(editTarget.id) : undefined}
      />
    </div>
  )
}
