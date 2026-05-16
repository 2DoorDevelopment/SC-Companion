import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { cargoProfit } from '../../lib/schema'
import type { CargoEntry } from '../../lib/schema'

interface CargoEntryCardProps {
  entry: CargoEntry
  onClick: () => void
}

export function CargoEntryCard({ entry, onClick }: CargoEntryCardProps) {
  const profit = cargoProfit(entry)
  const isSold = entry.status === 'sold'

  return (
    <article
      className="bg-bg-panel border border-border-subtle hover:border-border-active transition-colors cursor-pointer active:bg-bg-elevated p-3 flex flex-col gap-2"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-aldrich text-sm text-text-primary tracking-wide">{entry.commodity}</h3>
        <span className={cn(
          'flex-shrink-0 text-[10px] font-mono tracking-wider border px-1.5 py-0.5 rounded-sm',
          isSold
            ? 'text-status-ready border-status-ready/40 bg-status-ready/10'
            : 'text-status-delivery border-status-delivery/40 bg-status-delivery/10'
        )}>
          {isSold ? 'SOLD' : 'BOUGHT'}
        </span>
      </div>

      {/* Route */}
      <div className="flex items-center gap-1.5 text-xs font-inter text-text-secondary flex-wrap">
        <span className="truncate max-w-[120px]">{entry.buyLocation}</span>
        <ArrowRight size={11} className="flex-shrink-0 text-text-disabled" />
        <span className="truncate max-w-[120px]">{entry.sellLocation ?? '—'}</span>
      </div>

      {/* Numbers */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-text-secondary">{entry.quantitySCU} SCU</span>
        <div className="flex items-center gap-3">
          <span className="text-text-disabled">
            {entry.buyPricePerSCU.toLocaleString()} → {entry.sellPricePerSCU?.toLocaleString() ?? '?'} /SCU
          </span>
          {profit != null && (
            <span className={profit >= 0 ? 'text-status-ready' : 'text-status-destroyed'}>
              {profit >= 0 ? '+' : ''}{profit.toLocaleString()} UEC
            </span>
          )}
        </div>
      </div>

      <p className="text-xs font-mono text-text-disabled">
        {new Date(entry.date).toLocaleDateString()}
        {entry.ship && <span> · {entry.ship}</span>}
      </p>
    </article>
  )
}
