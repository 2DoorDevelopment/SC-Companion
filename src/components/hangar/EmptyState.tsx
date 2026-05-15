import { Rocket, Upload } from 'lucide-react'
import { Button } from '../ui/Button'

interface EmptyStateProps {
  onAddShip: () => void
  onImport: () => void
}

export function EmptyState({ onAddShip, onImport }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 p-8 text-center min-h-[60dvh]">
      <Rocket size={56} className="text-accent-cyan" strokeWidth={1} />
      <div className="flex flex-col gap-2">
        <h2 className="font-aldrich text-xl text-text-primary uppercase tracking-widest">
          No Ships Registered
        </h2>
        <p className="text-sm text-text-secondary max-w-xs">
          Add your first ship to begin tracking your fleet.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button variant="primary" size="lg" className="w-full" onClick={onAddShip}>
          ADD SHIP
        </Button>
        <button
          className="text-xs font-inter text-accent-cyan hover:text-accent-glow flex items-center justify-center gap-1.5 py-2"
          onClick={onImport}
        >
          <Upload size={12} />
          IMPORT FROM JSON
        </button>
      </div>
    </div>
  )
}
