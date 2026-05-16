import { MapPin } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { MiningRun, MiningStatus } from '../../lib/schema'
import { MINING_METHOD_LABELS, MINING_STATUS_LABELS } from '../../lib/schema'

const STATUS_STYLE: Record<MiningStatus, string> = {
  raw:       'text-text-secondary border-border-subtle',
  refining:  'text-status-delivery border-status-delivery/40 bg-status-delivery/10',
  ready:     'text-status-ready border-status-ready/40 bg-status-ready/10',
  collected: 'text-text-disabled border-border-subtle',
}

interface MiningRunCardProps {
  run: MiningRun
  onClick: () => void
}

export function MiningRunCard({ run, onClick }: MiningRunCardProps) {
  const totalSCU = run.minerals.reduce((s, m) => s + m.quantitySCU, 0)

  return (
    <article
      className="bg-bg-panel border border-border-subtle hover:border-border-active transition-colors cursor-pointer active:bg-bg-elevated p-3 flex flex-col gap-2"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h3 className="font-aldrich text-sm text-text-primary tracking-wide truncate">{run.location}</h3>
          <p className="text-xs font-inter text-text-secondary">
            {new Date(run.date).toLocaleDateString()} · {MINING_METHOD_LABELS[run.method]}
          </p>
        </div>
        <span className={cn(
          'flex-shrink-0 text-[10px] font-mono tracking-wider border px-1.5 py-0.5 rounded-sm',
          STATUS_STYLE[run.status]
        )}>
          {MINING_STATUS_LABELS[run.status].toUpperCase()}
        </span>
      </div>

      {run.minerals.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {run.minerals.map((m, i) => (
            <span key={i} className="text-[10px] font-mono text-text-secondary bg-bg-elevated border border-border-subtle px-1.5 py-0.5">
              {m.mineral} {m.quantitySCU} SCU
            </span>
          ))}
          {totalSCU > 0 && run.minerals.length > 1 && (
            <span className="text-[10px] font-mono text-accent-cyan">= {totalSCU} SCU</span>
          )}
        </div>
      )}

      {run.refineryLocation && (
        <p className="text-xs font-inter text-text-secondary flex items-center gap-1">
          <MapPin size={11} className="shrink-0" />
          {run.refineryLocation}
          {run.refineReadyAt && (
            <span className="ml-1 font-mono text-[10px]">
              · ready {new Date(run.refineReadyAt).toLocaleDateString()}
            </span>
          )}
        </p>
      )}
    </article>
  )
}
