import { useState } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { ShipStatus } from '../../lib/schema'

export interface HangarFilterState {
  search: string
  statuses: Set<ShipStatus>
  manufacturers: Set<string>
  sort: 'name' | 'model' | 'manufacturer' | 'status' | 'date'
}

const STATUS_CHIPS: { value: ShipStatus; label: string; color: string }[] = [
  { value: 'ready', label: 'READY', color: 'border-status-ready/50 text-status-ready data-[active]:bg-status-ready/10' },
  { value: 'in_delivery', label: 'IN DELIVERY', color: 'border-status-delivery/50 text-status-delivery data-[active]:bg-status-delivery/10' },
  { value: 'destroyed', label: 'DESTROYED', color: 'border-status-destroyed/50 text-status-destroyed data-[active]:bg-status-destroyed/10' },
]

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'model', label: 'Model' },
  { value: 'manufacturer', label: 'Manufacturer' },
  { value: 'status', label: 'Status' },
  { value: 'date', label: 'Date Added' },
] as const

interface HangarFiltersProps {
  filters: HangarFilterState
  onChange: (f: HangarFilterState) => void
  manufacturers: string[]
}

export function HangarFilters({ filters, onChange, manufacturers }: HangarFiltersProps) {
  const [mfgOpen, setMfgOpen] = useState(false)

  function toggleStatus(s: ShipStatus) {
    const next = new Set(filters.statuses)
    if (next.has(s)) next.delete(s)
    else next.add(s)
    onChange({ ...filters, statuses: next })
  }

  function toggleManufacturer(m: string) {
    const next = new Set(filters.manufacturers)
    if (next.has(m)) next.delete(m)
    else next.add(m)
    onChange({ ...filters, manufacturers: next })
  }

  return (
    <div className="flex flex-col gap-2 px-4 py-3 border-b border-border-subtle">
      {/* Search + sort row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled pointer-events-none" />
          <input
            type="search"
            placeholder="Search ships..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full h-9 pl-8 pr-3 bg-bg-elevated border border-border-subtle text-text-primary text-sm font-inter placeholder:text-text-disabled focus:outline-none focus:border-accent-cyan"
          />
        </div>
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value as HangarFilterState['sort'] })}
            className="h-9 pl-3 pr-7 bg-bg-elevated border border-border-subtle text-text-secondary text-xs font-inter appearance-none focus:outline-none focus:border-accent-cyan"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-disabled pointer-events-none" />
        </div>
      </div>

      {/* Status chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {STATUS_CHIPS.map((chip) => {
          const active = filters.statuses.has(chip.value)
          return (
            <button
              key={chip.value}
              data-active={active || undefined}
              className={cn(
                'flex-shrink-0 h-7 px-2.5 text-[10px] font-mono tracking-wider border transition-colors',
                chip.color,
                !active && 'opacity-50'
              )}
              onClick={() => toggleStatus(chip.value)}
            >
              {chip.label}
            </button>
          )
        })}
      </div>

      {/* Manufacturer filter collapsible */}
      {manufacturers.length > 0 && (
        <div>
          <button
            className="flex items-center gap-1 text-xs font-inter text-text-secondary hover:text-text-primary py-1"
            onClick={() => setMfgOpen((o) => !o)}
          >
            {mfgOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            MANUFACTURERS
            {filters.manufacturers.size > 0 && (
              <span className="ml-1 text-accent-cyan">({filters.manufacturers.size})</span>
            )}
          </button>
          {mfgOpen && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {manufacturers.map((m) => {
                const active = filters.manufacturers.has(m)
                return (
                  <button
                    key={m}
                    className={cn(
                      'h-7 px-2.5 text-[10px] font-inter tracking-wider border transition-colors',
                      active
                        ? 'border-accent-cyan text-accent-cyan bg-accent-cyan/10'
                        : 'border-border-subtle text-text-secondary hover:border-border-active'
                    )}
                    onClick={() => toggleManufacturer(m)}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
