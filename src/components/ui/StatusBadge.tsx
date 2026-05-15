import type { ShipStatus } from '../../lib/schema'
import { cn } from '../../lib/cn'

const STATUS_CONFIG: Record<ShipStatus, { label: string; color: string }> = {
  ready: { label: 'READY', color: 'text-status-ready border-status-ready/40 bg-status-ready/10' },
  in_delivery: {
    label: 'IN DELIVERY',
    color: 'text-status-delivery border-status-delivery/40 bg-status-delivery/10',
  },
  destroyed: {
    label: 'DESTROYED',
    color: 'text-status-destroyed border-status-destroyed/40 bg-status-destroyed/10',
  },
}

interface StatusBadgeProps {
  status: ShipStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, color } = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium border rounded-sm tracking-wider',
        color,
        className
      )}
    >
      {label}
    </span>
  )
}
