import { Clock, MapPin } from 'lucide-react'
import { cn } from '../../lib/cn'
import { MISSION_TYPE_LABELS, MISSION_STATUS_LABELS } from '../../lib/schema'
import type { Mission, MissionStatus } from '../../lib/schema'

const STATUS_STYLES: Record<MissionStatus, string> = {
  active: 'text-accent-cyan border-accent-cyan/40 bg-accent-cyan/10',
  completed: 'text-status-ready border-status-ready/40 bg-status-ready/10',
  failed: 'text-status-destroyed border-status-destroyed/40 bg-status-destroyed/10',
  abandoned: 'text-text-disabled border-border-subtle bg-bg-elevated',
}

interface MissionCardProps {
  mission: Mission
  onClick: () => void
}

export function MissionCard({ mission, onClick }: MissionCardProps) {
  const isExpiringSoon = mission.expiresAt && mission.status === 'active'
    ? (new Date(mission.expiresAt).getTime() - Date.now()) < 1000 * 60 * 60 * 24
    : false

  return (
    <article
      className="bg-bg-panel border border-border-subtle hover:border-border-active transition-colors cursor-pointer active:bg-bg-elevated p-3 flex flex-col gap-2"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-aldrich text-sm text-text-primary tracking-wide leading-snug flex-1">{mission.title}</h3>
        <span className={cn(
          'flex-shrink-0 text-[10px] font-mono tracking-wider border px-1.5 py-0.5 rounded-sm',
          STATUS_STYLES[mission.status]
        )}>
          {MISSION_STATUS_LABELS[mission.status].toUpperCase()}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-mono text-text-secondary border border-border-subtle px-1.5 py-0.5">
          {MISSION_TYPE_LABELS[mission.type].toUpperCase()}
        </span>
        {mission.faction && (
          <span className="text-[10px] font-mono text-text-disabled">{mission.faction}</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-3 flex-wrap">
          {mission.location && (
            <span className="flex items-center gap-1 text-text-secondary">
              <MapPin size={10} className="flex-shrink-0" />
              {mission.location}
            </span>
          )}
          {mission.expiresAt && (
            <span className={cn(
              'flex items-center gap-1',
              isExpiringSoon ? 'text-status-destroyed' : 'text-text-disabled'
            )}>
              <Clock size={10} className="flex-shrink-0" />
              {new Date(mission.expiresAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <span className={cn(
          'font-mono font-medium',
          mission.status === 'completed' ? 'text-status-ready' : 'text-text-primary'
        )}>
          {mission.payoutUEC.toLocaleString()} UEC
        </span>
      </div>
    </article>
  )
}
