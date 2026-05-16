import { useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2, Plus } from 'lucide-react'
import { BottomSheet } from '../ui/BottomSheet'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Autocomplete } from '../ui/Autocomplete'
import {
  MiningRunFormSchema,
  MINING_METHOD_LABELS,
  MINING_STATUS_LABELS,
  COMMON_MINERALS,
} from '../../lib/schema'
import type { MiningRun, MiningRunFormValues, MiningMethod, MiningStatus } from '../../lib/schema'

const METHOD_OPTIONS = (Object.keys(MINING_METHOD_LABELS) as MiningMethod[]).map((k) => ({
  value: k,
  label: MINING_METHOD_LABELS[k],
}))

const STATUS_OPTIONS = (Object.keys(MINING_STATUS_LABELS) as MiningStatus[]).map((k) => ({
  value: k,
  label: MINING_STATUS_LABELS[k],
}))

const REFINERY_LOCATIONS = [
  'CRU-L1', 'CRU-L5', 'HUR-L1', 'HUR-L2', 'HUR-L3', 'HUR-L4', 'HUR-L5',
  'ARC-L1', 'ARC-L2', 'ARC-L3', 'ARC-L4', 'ARC-L5', 'MIC-L1', 'MIC-L2',
  'Levski', 'Area18',
]

interface MiningRunFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  run?: MiningRun
  onSave: (values: MiningRunFormValues) => void
  onDelete?: () => void
}

export function MiningRunFormSheet({ open, onOpenChange, run, onSave, onDelete }: MiningRunFormSheetProps) {
  const isEdit = Boolean(run)
  const today = new Date().toISOString().slice(0, 10)

  const { register, handleSubmit, control, watch, reset, formState: { errors } } =
    useForm<MiningRunFormValues>({
      resolver: zodResolver(MiningRunFormSchema),
      defaultValues: {
        date: today,
        location: '',
        method: 'ship',
        ship: '',
        minerals: [],
        status: 'raw',
        refineryLocation: '',
        refineStartedAt: '',
        refineReadyAt: '',
        notes: '',
      },
    })

  const { fields, append, remove } = useFieldArray({ control, name: 'minerals' })
  const status = watch('status')

  useEffect(() => {
    if (open) {
      if (run) {
        reset({
          date: run.date,
          location: run.location,
          method: run.method,
          ship: run.ship ?? '',
          minerals: run.minerals,
          status: run.status,
          refineryLocation: run.refineryLocation ?? '',
          refineStartedAt: run.refineStartedAt ?? '',
          refineReadyAt: run.refineReadyAt ?? '',
          notes: run.notes ?? '',
        })
      } else {
        reset({ date: today, location: '', method: 'ship', ship: '', minerals: [], status: 'raw', refineryLocation: '', refineStartedAt: '', refineReadyAt: '', notes: '' })
      }
    }
  }, [open, run, reset, today])

  function onSubmit(values: MiningRunFormValues) {
    onSave(values)
    onOpenChange(false)
  }

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title={isEdit ? 'EDIT RUN' : 'LOG RUN'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-safe">
        <div className="grid grid-cols-2 gap-3">
          <Input {...register('date')} label="Date *" id="run-date" type="date" error={errors.date?.message} />
          <Controller
            name="method"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Method *" id="run-method" options={METHOD_OPTIONS} />
            )}
          />
        </div>

        <Input {...register('location')} label="Location *" id="run-location" placeholder="Yela Belt, Daymar..." error={errors.location?.message} />
        <Input {...register('ship')} label="Ship / Tool" id="run-ship" placeholder="Prospector, MOLE..." />

        {/* Minerals */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide">Minerals</span>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-accent-cyan hover:text-accent-glow py-1"
              onClick={() => append({ mineral: '', quantitySCU: 0 })}
            >
              <Plus size={12} /> Add Mineral
            </button>
          </div>
          {fields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <Controller
                  name={`minerals.${i}.mineral`}
                  control={control}
                  render={({ field: f }) => (
                    <Autocomplete
                      value={f.value}
                      onChange={f.onChange}
                      suggestions={COMMON_MINERALS}
                      placeholder="Mineral name"
                    />
                  )}
                />
              </div>
              <div className="w-24">
                <Input
                  {...register(`minerals.${i}.quantitySCU`)}
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="SCU"
                />
              </div>
              <button type="button" className="mt-0 pt-2 text-text-disabled hover:text-status-destroyed" onClick={() => remove(i)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select {...field} label="Status *" id="run-status" options={STATUS_OPTIONS} />
          )}
        />

        {(status === 'refining' || status === 'ready' || status === 'collected') && (
          <>
            <Controller
              name="refineryLocation"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  label="Refinery"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  suggestions={REFINERY_LOCATIONS}
                  placeholder="e.g. HUR-L1"
                />
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input {...register('refineStartedAt')} label="Started" id="refine-start" type="date" />
              <Input {...register('refineReadyAt')} label="Ready" id="refine-ready" type="date" />
            </div>
          </>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="run-notes" className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide">Notes</label>
          <textarea
            {...register('notes')}
            id="run-notes"
            rows={2}
            placeholder="Optional notes..."
            className="px-3 py-2 bg-bg-elevated border border-border-subtle text-text-primary font-inter text-sm placeholder:text-text-disabled focus:outline-none focus:border-accent-cyan resize-none"
          />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button type="submit" variant="primary" size="lg" className="w-full">
            {isEdit ? 'SAVE CHANGES' : 'LOG RUN'}
          </Button>
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => onOpenChange(false)}>CANCEL</Button>
          {isEdit && onDelete && (
            <Button type="button" variant="danger" size="md" className="w-full mt-2"
              onClick={() => { onDelete(); onOpenChange(false) }}>
              <Trash2 size={14} className="mr-2" /> DELETE RUN
            </Button>
          )}
        </div>
      </form>
    </BottomSheet>
  )
}
