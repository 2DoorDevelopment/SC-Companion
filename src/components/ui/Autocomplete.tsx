import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/cn'

interface AutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (value: string) => void
  suggestions: string[]
  label?: string
  error?: string
  placeholder?: string
  id?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export function Autocomplete({
  value,
  onChange,
  onSelect,
  suggestions,
  label,
  error,
  placeholder,
  id,
  inputProps,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = value
    ? suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase())).slice(0, 8)
    : suggestions.slice(0, 8)

  useEffect(() => {
    setHighlighted(0)
  }, [value])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(s: string) {
    onChange(s)
    onSelect?.(s)
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === 'ArrowDown') { setOpen(true); return }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && filtered[highlighted]) {
      e.preventDefault()
      handleSelect(filtered[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-1 relative">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <input
        {...inputProps}
        id={id}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          'h-10 px-3 bg-bg-elevated border border-border-subtle text-text-primary font-inter text-sm placeholder:text-text-disabled',
          'focus:outline-none focus:border-accent-cyan',
          'min-h-[44px] w-full',
          error && 'border-status-destroyed'
        )}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {error && <p className="text-xs text-status-destroyed">{error}</p>}
      {open && filtered.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-50 bg-bg-elevated border border-border-active max-h-48 overflow-y-auto scrollbar-thin mt-px">
          {filtered.map((s, i) => (
            <li
              key={s}
              className={cn(
                'px-3 py-2.5 text-sm font-inter cursor-pointer min-h-[44px] flex items-center',
                i === highlighted
                  ? 'bg-bg-void text-accent-cyan'
                  : 'text-text-primary hover:bg-bg-void'
              )}
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelect(s)
              }}
              onMouseEnter={() => setHighlighted(i)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
