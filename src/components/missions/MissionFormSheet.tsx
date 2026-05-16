import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { BottomSheet } from '../ui/BottomSheet'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Autocomplete } from '../ui/Autocomplete'
import {
  MissionFormSchema, MISSION_TYPE_LABELS, COMMON_FACTIONS,
} from '../../lib/schema'
import type { Mission, MissionFormValues, MissionStatus, MissionType } from '../../lib/schema'
import { cn } from '../../lib/cn'

const TYPE_OPTIONS = Object.entries(MISSION_TYPE_LABELS).map(([value, label]) => ({ value: value as MissionType, label }))

const STATUS_OPTIONS: { value: MissionStatus; label: string; dot: string }[] = [
  { value: 'active', label: 'Active — in progress', dot: 'bg-accent-cyan' },
  { value: 'completed', label: 'Completed — payout received', dot: 'bg-status-ready' },
  { value: 'failed', label: 'Failed', dot: 'bg-status-destroyed' },
  { value: 'abandoned', label: 'Abandoned', dot: 'bg-text-disabled' },
]

interface MissionFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mission?: Mission
  onSave: (values: MissionFormValues) => void
  onDelete?: () => void
}

export function MissionFormSheet({ open, onOpenChange, mission, onSave, onDelete }: MissionFormSheetProps) {
  const isEdit = Boolean(mission)

  const { register, handleSubmit, control, reset, formState: { errors } } =
    useForm<MissionFormValues>({
      resolver: zodResolver(MissionFormSchema),
      defaultValues: {
        title: '',
        type: 'delivery',
        faction: '',
        payoutUEC: 0,
        status: 'active',
        location: '',
        expiresAt: '',
        notes: '',
      },
    })

  useEffect(() => {
    if (open) {
      if (mission) {
        reset({
          title: mission.title,
          type: mission.type,
          faction: mission.faction ?? '',
          payoutUEC: mission.payoutUEC,
          status: mission.status,
          location: mission.location ?? '',
          expiresAt: mission.expiresAt ?? '',
          notes: mission.notes ?? '',
        })
      } else {
        reset({ title: '', type: 'delivery', faction: '', payoutUEC: 0, status: 'active', location: '', expiresAt: '', notes: '' })
      }
    }
  }, [open, mission, reset])

  function onSubmit(values: MissionFormValues) {
    onSave(values)
    onOpenChange(false)
  }

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title={isEdit ? 'EDIT MISSION' : 'ADD MISSION'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-safe">
        <Input
          {...register('title')}
          label="Title *"
          id="mission-title"
          placeholder="e.g. Eliminate Hostile Leader"
          error={errors.title?.message}
        />

        {/* Type */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="mission-type" className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide">Type *</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <select
                id="mission-type"
                value={field.value}
                onChange={e => field.onChange(e.target.value as MissionType)}
                className="h-11 px-3 bg-bg-elevated border border-border-subtle text-text-primary font-inter text-sm focus:outline-none focus:border-accent-cyan"
              >
                {TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
          />
        </div>

        <Controller
          name="faction"
          control={control}
          render={({ field }) => (
            <Autocomplete
              label="Faction"
              value={field.value ?? ''}
              onChange={field.onChange}
              suggestions={COMMON_FACTIONS}
              placeholder="e.g. Advocacy"
            />
          )}
        />

        <Input
          {...register('payoutUEC')}
          label="Payout (UEC) *"
          id="mission-payout"
          type="number"
          min={0}
          step={1}
          error={errors.payoutUEC?.message}
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
                    <span className={cn(`w-2.5 h-2.5 rounded-full flex-shrink-0`, opt.dot, field.value === opt.value ? 'ring-2 ring-offset-1 ring-offset-bg-elevated ring-current' : '')} />
                    <span className="text-sm font-inter text-text-primary">{opt.label}</span>
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

        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <Autocomplete
              label="Location"
              value={field.value ?? ''}
              onChange={field.onChange}
              suggestions={['Area18', 'Lorville', 'New Babbage', 'Orison', 'Port Tressler', 'Baijini Point', 'CRU-L5', 'HUR-L2', 'GrimHEX', 'Pyro']}
              placeholder="e.g. Stanton system"
            />
          )}
        />

        <Input
          {...register('expiresAt')}
          label="Expires"
          id="mission-expires"
          type="date"
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="mission-notes" className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide">Notes</label>
          <textarea
            {...register('notes')}
            id="mission-notes"
            rows={2}
            placeholder="Optional notes..."
            className="px-3 py-2 bg-bg-elevated border border-border-subtle text-text-primary font-inter text-sm placeholder:text-text-disabled focus:outline-none focus:border-accent-cyan resize-none"
          />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button type="submit" variant="primary" size="lg" className="w-full">
            {isEdit ? 'SAVE CHANGES' : 'ADD MISSION'}
          </Button>
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => onOpenChange(false)}>
            CANCEL
          </Button>
          {isEdit && onDelete && (
            <Button type="button" variant="danger" size="md" className="w-full mt-2" onClick={() => { onDelete(); onOpenChange(false) }}>
              <Trash2 size={14} className="mr-2" /> DELETE MISSION
            </Button>
          )}
        </div>
      </form>
    </BottomSheet>
  )
}
