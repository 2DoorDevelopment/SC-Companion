import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full h-10 pl-3 pr-8 bg-bg-elevated border border-border-subtle text-text-primary font-inter text-sm appearance-none',
              'focus:outline-none focus:border-accent-cyan',
              'min-h-[44px]',
              error && 'border-status-destroyed',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-status-destroyed">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
