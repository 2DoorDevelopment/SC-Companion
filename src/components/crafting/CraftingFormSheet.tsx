import { useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2, Plus } from 'lucide-react'
import { BottomSheet } from '../ui/BottomSheet'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import {
  CraftingProjectFormSchema,
  CRAFTING_STATUS_LABELS,
} from '../../lib/schema'
import type { CraftingProject, CraftingProjectFormValues, CraftingStatus } from '../../lib/schema'
import { cn } from '../../lib/cn'

const STATUS_OPTIONS: { value: CraftingStatus; label: string; dot: string }[] = [
  { value: 'planned', label: 'Planned', dot: 'bg-text-disabled' },
  { value: 'in_progress', label: 'In Progress', dot: 'bg-accent-cyan' },
  { value: 'completed', label: 'Completed', dot: 'bg-status-ready' },
]

interface CraftingFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: CraftingProject
  onSave: (values: CraftingProjectFormValues) => void
  onDelete?: () => void
}

export function CraftingFormSheet({ open, onOpenChange, project, onSave, onDelete }: CraftingFormSheetProps) {
  const isEdit = Boolean(project)

  const { register, handleSubmit, control, reset, formState: { errors } } =
    useForm<CraftingProjectFormValues>({
      resolver: zodResolver(CraftingProjectFormSchema),
      defaultValues: {
        name: '',
        quantity: 1,
        status: 'planned',
        materials: [],
        notes: '',
      },
    })

  const { fields, append, remove } = useFieldArray({ control, name: 'materials' })

  useEffect(() => {
    if (open) {
      if (project) {
        reset({
          name: project.name,
          quantity: project.quantity,
          status: project.status,
          materials: project.materials,
          notes: project.notes ?? '',
        })
      } else {
        reset({ name: '', quantity: 1, status: 'planned', materials: [], notes: '' })
      }
    }
  }, [open, project, reset])

  function onSubmit(values: CraftingProjectFormValues) {
    onSave(values)
    onOpenChange(false)
  }

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title={isEdit ? 'EDIT PROJECT' : 'NEW PROJECT'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-safe">
        <Input
          {...register('name')}
          label="Item Name *"
          id="craft-name"
          placeholder="e.g. Cyclone, Ballistic Shield..."
          error={errors.name?.message}
        />

        <Input
          {...register('quantity')}
          label="Quantity *"
          id="craft-qty"
          type="number"
          min={1}
          step={1}
          error={errors.quantity?.message}
        />

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide">Status *</span>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                {STATUS_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-3 h-11 px-3 bg-bg-elevated border border-border-subtle cursor-pointer">
                    <input type="radio" value={opt.value} checked={field.value === opt.value} onChange={() => field.onChange(opt.value)} className="sr-only" />
                    <span className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', opt.dot, field.value === opt.value ? 'ring-2 ring-offset-1 ring-offset-bg-elevated ring-current' : '')} />
                    <span className="text-sm font-inter text-text-primary">{CRAFTING_STATUS_LABELS[opt.value]}</span>
                    {field.value === opt.value && (
                      <span className="ml-auto w-4 h-4 rounded-full bg-accent-cyan flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-bg-void" />
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Materials */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide">Materials</span>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-accent-cyan hover:text-accent-glow py-1"
              onClick={() => append({ name: '', quantityNeeded: 1, quantityOwned: 0 })}
            >
              <Plus size={12} /> Add Material
            </button>
          </div>
          {fields.length === 0 && (
            <p className="text-xs text-text-disabled font-inter py-2 text-center border border-dashed border-border-subtle">
              No materials added — tap "Add Material" to track requirements.
            </p>
          )}
          {fields.map((field, i) => (
            <div key={field.id} className="flex flex-col gap-1.5 p-2 border border-border-subtle bg-bg-elevated">
              <div className="flex items-center gap-2">
                <Input
                  {...register(`materials.${i}.name`)}
                  placeholder="Material name"
                  className="flex-1"
                />
                <button type="button" className="text-text-disabled hover:text-status-destroyed flex-shrink-0 mt-0.5" onClick={() => remove(i)}>
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-text-disabled uppercase tracking-wide">Needed</label>
                  <Input
                    {...register(`materials.${i}.quantityNeeded`)}
                    type="number"
                    min={0}
                    step={1}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-text-disabled uppercase tracking-wide">Owned</label>
                  <Input
                    {...register(`materials.${i}.quantityOwned`)}
                    type="number"
                    min={0}
                    step={1}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="craft-notes" className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide">Notes</label>
          <textarea
            {...register('notes')}
            id="craft-notes"
            rows={2}
            placeholder="Optional notes..."
            className="px-3 py-2 bg-bg-elevated border border-border-subtle text-text-primary font-inter text-sm placeholder:text-text-disabled focus:outline-none focus:border-accent-cyan resize-none"
          />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button type="submit" variant="primary" size="lg" className="w-full">
            {isEdit ? 'SAVE CHANGES' : 'CREATE PROJECT'}
          </Button>
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => onOpenChange(false)}>
            CANCEL
          </Button>
          {isEdit && onDelete && (
            <Button type="button" variant="danger" size="md" className="w-full mt-2" onClick={() => { onDelete(); onOpenChange(false) }}>
              <Trash2 size={14} className="mr-2" /> DELETE PROJECT
            </Button>
          )}
        </div>
      </form>
    </BottomSheet>
  )
}
