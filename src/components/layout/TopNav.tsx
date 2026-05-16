import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Download, Upload } from 'lucide-react'
import { cn } from '../../lib/cn'
import { exportData } from '../../lib/export-import'
import type { AppData } from '../../lib/schema'

const NAV_ITEMS = [
  { label: 'HANGAR', path: '/hangar', enabled: true },
  { label: 'INVENTORY', path: '/inventory', enabled: true },
  { label: 'CRAFTING', path: '/crafting', enabled: false },
  { label: 'CARGO', path: '/cargo', enabled: true },
  { label: 'MINING', path: '/mining', enabled: true },
  { label: 'MISSIONS', path: '/missions', enabled: false },
]

interface TopNavProps {
  data: AppData
  onImportClick: () => void
}

export function TopNav({ data, onImportClick }: TopNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      {/* Nav bar */}
      <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-bg-panel border-b border-accent-cyan-dim/30 flex items-center px-4"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {/* Mobile: hamburger */}
        <button
          className="md:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        {/* Wordmark */}
        <span
          className="font-aldrich text-accent-cyan text-lg tracking-widest cursor-pointer mx-auto md:mx-0"
          onClick={() => navigate('/hangar')}
        >
          SC-COMPANION
        </span>

        {/* Desktop tab strip */}
        <nav className="hidden md:flex items-center gap-1 ml-8 flex-1">
          {NAV_ITEMS.map((item) =>
            item.enabled ? (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-1.5 text-xs font-inter font-medium tracking-wider transition-colors',
                    isActive
                      ? 'text-accent-cyan border-b-2 border-accent-cyan'
                      : 'text-text-secondary hover:text-text-primary'
                  )
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                key={item.path}
                className="px-3 py-1.5 text-xs font-inter font-medium tracking-wider text-text-disabled flex items-center gap-1.5 cursor-not-allowed"
              >
                {item.label}
                <span className="text-[9px] font-mono bg-bg-elevated border border-border-subtle px-1 py-px">
                  SOON
                </span>
              </span>
            )
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto md:ml-2">
          <button
            className="p-2 text-text-secondary hover:text-text-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => exportData(data)}
            aria-label="Export data"
            title="Export JSON"
          >
            <Download size={18} />
          </button>
          <button
            className="p-2 text-text-secondary hover:text-text-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={onImportClick}
            aria-label="Import data"
            title="Import JSON"
          >
            <Upload size={18} />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 w-72 bg-bg-panel border-r border-border-subtle flex flex-col transition-transform duration-300 md:hidden',
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-border-subtle flex-shrink-0">
          <span className="font-aldrich text-accent-cyan tracking-widest">SC-COMPANION</span>
          <button
            className="p-2 text-text-secondary hover:text-text-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setDrawerOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map((item) =>
            item.enabled ? (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-6 py-3.5 text-sm font-inter font-medium tracking-wider min-h-[44px] transition-colors',
                    isActive
                      ? 'text-accent-cyan bg-accent-cyan/5 border-l-2 border-accent-cyan'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                  )
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                key={item.path}
                className="flex items-center justify-between px-6 py-3.5 text-sm font-inter font-medium tracking-wider text-text-disabled"
              >
                {item.label}
                <span className="text-[9px] font-mono bg-bg-elevated border border-border-subtle px-1.5 py-0.5">
                  SOON
                </span>
              </span>
            )
          )}
        </nav>
        <div className="border-t border-border-subtle p-4 flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-2 h-10 text-xs font-inter text-text-secondary border border-border-subtle hover:text-text-primary hover:bg-bg-elevated transition-colors"
            onClick={() => { exportData(data); setDrawerOpen(false) }}
          >
            <Download size={14} /> EXPORT
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 h-10 text-xs font-inter text-text-secondary border border-border-subtle hover:text-text-primary hover:bg-bg-elevated transition-colors"
            onClick={() => { onImportClick(); setDrawerOpen(false) }}
          >
            <Upload size={14} /> IMPORT
          </button>
        </div>
      </aside>
    </>
  )
}
