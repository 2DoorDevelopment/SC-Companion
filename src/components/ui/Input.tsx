import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
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
        <input
          ref={ref}
          id={id}
          className={cn(
            'h-10 px-3 bg-bg-elevated border border-border-subtle text-text-primary font-inter text-sm placeholder:text-text-disabled',
            'focus:outline-none focus:border-accent-cyan focus:ring-0',
            'min-h-[44px]',
            error && 'border-status-destroyed',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-status-destroyed">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
