import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-inter font-medium tracking-wide transition-colors focus:outline-none focus:ring-1 focus:ring-accent-cyan disabled:opacity-40 disabled:pointer-events-none',
          size === 'sm' && 'h-8 px-3 text-xs',
          size === 'md' && 'h-10 px-4 text-sm min-h-[44px]',
          size === 'lg' && 'h-12 px-6 text-base min-h-[44px]',
          variant === 'primary' &&
            'bg-accent-cyan text-bg-void hover:bg-accent-glow shadow-lg shadow-accent-cyan/20',
          variant === 'secondary' &&
            'bg-bg-elevated text-text-primary border border-border-subtle hover:bg-[#1f2d3d]',
          variant === 'ghost' &&
            'text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
          variant === 'danger' &&
            'bg-status-destroyed/10 text-status-destroyed border border-status-destroyed/30 hover:bg-status-destroyed/20',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
