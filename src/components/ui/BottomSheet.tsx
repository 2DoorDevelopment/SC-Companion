import { Drawer } from 'vaul'
import { cn } from '../../lib/cn'

interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
  snapPoints?: number[]
  className?: string
}

export function BottomSheet({
  open,
  onOpenChange,
  children,
  title,
  className,
}: BottomSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-bg-panel border-t border-border-subtle',
            'max-h-[92dvh]',
            className
          )}
          aria-label={title}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 bg-border-active rounded-full" />
          </div>
          {title && (
            <div className="flex-shrink-0 px-4 py-3 border-b border-border-subtle">
              <Drawer.Title className="font-aldrich text-base text-text-primary uppercase tracking-wider">
                {title}
              </Drawer.Title>
            </div>
          )}
          <div className="flex-1 overflow-y-auto scrollbar-thin">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
