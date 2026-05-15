import { Construction } from 'lucide-react'

interface ComingSoonProps {
  module: string
}

export function ComingSoon({ module }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8 text-center">
      <Construction size={48} className="text-text-disabled" strokeWidth={1} />
      <h2 className="font-aldrich text-xl text-text-primary uppercase tracking-widest">
        {module}
      </h2>
      <p className="text-sm text-text-secondary max-w-xs">
        This module is under construction. Check back in a future update.
      </p>
    </div>
  )
}
