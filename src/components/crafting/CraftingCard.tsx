import { cn } from '../../lib/cn'
import { CRAFTING_STATUS_LABELS } from '../../lib/schema'
import type { CraftingProject, CraftingStatus } from '../../lib/schema'

const STATUS_STYLES: Record<CraftingStatus, string> = {
  planned: 'text-text-secondary border-border-subtle bg-bg-elevated',
  in_progress: 'text-accent-cyan border-accent-cyan/40 bg-accent-cyan/10',
  completed: 'text-status-ready border-status-ready/40 bg-status-ready/10',
}

function materialProgress(project: CraftingProject): { ready: number; total: number } {
  if (project.materials.length === 0) return { ready: 0, total: 0 }
  const ready = project.materials.filter(m => m.quantityOwned >= m.quantityNeeded).length
  return { ready, total: project.materials.length }
}

interface CraftingCardProps {
  project: CraftingProject
  onClick: () => void
}

export function CraftingCard({ project, onClick }: CraftingCardProps) {
  const { ready, total } = materialProgress(project)
  const pct = total > 0 ? Math.round((ready / total) * 100) : 0
  const allReady = total > 0 && ready === total

  return (
    <article
      className="bg-bg-panel border border-border-subtle hover:border-border-active transition-colors cursor-pointer active:bg-bg-elevated p-3 flex flex-col gap-2"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-aldrich text-sm text-text-primary tracking-wide truncate">{project.name}</h3>
          {project.quantity > 1 && (
            <span className="text-xs font-mono text-text-disabled">×{project.quantity}</span>
          )}
        </div>
        <span className={cn(
          'flex-shrink-0 text-[10px] font-mono tracking-wider border px-1.5 py-0.5 rounded-sm',
          STATUS_STYLES[project.status]
        )}>
          {CRAFTING_STATUS_LABELS[project.status].toUpperCase()}
        </span>
      </div>

      {total > 0 && (
        <div className="flex flex-col gap-1">
          {/* Progress bar */}
          <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className={cn('h-full transition-all', allReady ? 'bg-status-ready' : 'bg-accent-cyan')}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-text-disabled">
            <span>{ready}/{total} materials ready</span>
            <span>{pct}%</span>
          </div>
        </div>
      )}

      {/* Missing materials preview */}
      {project.status !== 'completed' && project.materials.some(m => m.quantityOwned < m.quantityNeeded) && (
        <div className="flex flex-wrap gap-1 mt-0.5">
          {project.materials
            .filter(m => m.quantityOwned < m.quantityNeeded)
            .slice(0, 3)
            .map((m, i) => (
              <span key={i} className="text-[10px] font-mono text-status-destroyed bg-status-destroyed/10 border border-status-destroyed/20 px-1.5 py-0.5 rounded-sm">
                {m.name} ({m.quantityOwned}/{m.quantityNeeded})
              </span>
            ))}
          {project.materials.filter(m => m.quantityOwned < m.quantityNeeded).length > 3 && (
            <span className="text-[10px] font-mono text-text-disabled">
              +{project.materials.filter(m => m.quantityOwned < m.quantityNeeded).length - 3} more
            </span>
          )}
        </div>
      )}
    </article>
  )
}
