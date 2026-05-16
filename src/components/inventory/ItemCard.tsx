import { MapPin } from 'lucide-react'
import { CATEGORY_LABELS } from '../../lib/schema'
import type { InventoryItem } from '../../lib/schema'

interface ItemCardProps {
  item: InventoryItem
  onClick: () => void
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  return (
    <article
      className="bg-bg-panel border border-border-subtle hover:border-border-active transition-colors cursor-pointer active:bg-bg-elevated p-3 flex flex-col gap-1.5"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-aldrich text-sm text-text-primary tracking-wide leading-tight">{item.name}</h3>
        <span className="flex-shrink-0 font-mono text-xs text-text-primary bg-bg-elevated border border-border-subtle px-1.5 py-0.5">
          ×{item.quantity}
        </span>
      </div>

      <p className="text-xs font-inter text-text-secondary uppercase tracking-wider">
        {CATEGORY_LABELS[item.category]}
      </p>

      {item.location && (
        <p className="text-xs font-inter text-text-secondary flex items-center gap-1">
          <MapPin size={11} className="shrink-0" />
          <span className="truncate">{item.location}</span>
        </p>
      )}

      {item.priceUEC != null && (
        <p className="text-xs font-mono text-accent-cyan mt-0.5">
          {item.priceUEC.toLocaleString()} UEC
        </p>
      )}
    </article>
  )
}
