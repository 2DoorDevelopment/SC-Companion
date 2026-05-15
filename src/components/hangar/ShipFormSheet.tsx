import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { BottomSheet } from '../ui/BottomSheet'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Autocomplete } from '../ui/Autocomplete'
import { ShipFormSchema } from '../../lib/schema'
import type { Ship, ShipFormValues } from '../../lib/schema'
import { SHIP_LIST, getManufacturerForModel } from '../../data/ships'

const STATUS_OPTIONS: { value: ShipFormValues['status']; label: string; dot: string }[] = [
  { value: 'ready', label: 'Ready', dot: 'bg-status-ready' },
  { value: 'in_delivery', label: 'In Delivery', dot: 'bg-status-delivery' },
  { value: 'destroyed', label: 'Destroyed', dot: 'bg-status-destroyed' },
]

const MODEL_SUGGESTIONS = SHIP_LIST.map((s) => s.model)
const MANUFACTURER_SUGGESTIONS = [...new Set(SHIP_LIST.map((s) => s.manufacturer))].sort()

interface ShipFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ship?: Ship
  onSave: (values: ShipFormValues) => void
  onDelete?: () => void
}

export function ShipFormSheet({ open, onOpenChange, ship, onSave, onDelete }: ShipFormSheetProps) {
  const isEdit = Boolean(ship)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ShipFormValues>({
    resolver: zodResolver(ShipFormSchema),
    defaultValues: {
      model: '',
      manufacturer: '',
      name: '',
      status: 'ready',
      location: '',
      buildLink: '',
      buildSiteName: '',
      acquiredAt: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (ship) {
        reset({
          model: ship.model,
          manufacturer: ship.manufacturer,
          name: ship.name !== ship.model ? ship.name : '',
          status: ship.status,
          location: ship.location,
          buildLink: ship.buildLink ?? '',
          buildSiteName: ship.buildSiteName ?? '',
          acquiredAt: ship.acquiredAt ?? '',
          notes: ship.notes ?? '',
        })
      } else {
        reset({
          model: '',
          manufacturer: '',
          name: '',
          status: 'ready',
          location: '',
          buildLink: '',
          buildSiteName: '',
          acquiredAt: '',
          notes: '',
        })
      }
    }
  }, [open, ship, reset])

  const buildLink = watch('buildLink')
  const modelValue = watch('model')

  function onModelSelect(model: string) {
    setValue('model', model)
    const mfg = getManufacturerForModel(model)
    if (mfg) setValue('manufacturer', mfg)
  }

  function onSubmit(values: ShipFormValues) {
    onSave(values)
    onOpenChange(false)
  }

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'EDIT SHIP' : 'ADD SHIP'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-safe">
        {/* Model */}
        <Controller
          name="model"
          control={control}
          render={({ field }) => (
            <Autocomplete
              label="Ship Model *"
              id="model"
              value={field.value}
              onChange={(v) => {
                field.onChange(v)
              }}
              onSelect={onModelSelect}
              suggestions={MODEL_SUGGESTIONS}
              placeholder="e.g. Polaris"
              error={errors.model?.message}
            />
          )}
        />

        {/* Manufacturer */}
        <Controller
          name="manufacturer"
          control={control}
          render={({ field }) => (
            <Autocomplete
              label="Manufacturer *"
              id="manufacturer"
              value={field.value}
              onChange={field.onChange}
              suggestions={MANUFACTURER_SUGGESTIONS}
              placeholder="e.g. RSI"
              error={errors.manufacturer?.message}
            />
          )}
        />

        {/* Custom name */}
        <Input
          {...register('name')}
          label="Custom Name"
          id="name"
          placeholder={modelValue || 'Display name'}
          error={errors.name?.message}
        />

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide">
            Status *
          </span>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                {STATUS_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 h-11 px-3 bg-bg-elevated border border-border-subtle cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      checked={field.value === opt.value}
                      onChange={() => field.onChange(opt.value)}
                      className="sr-only"
                    />
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${opt.dot} flex-shrink-0 ${
                        field.value === opt.value ? 'ring-2 ring-offset-1 ring-offset-bg-elevated ring-current' : ''
                      }`}
                    />
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

        {/* Location */}
        <Input
          {...register('location')}
          label="Location"
          id="location"
          placeholder="Port Olisar, Area18..."
          error={errors.location?.message}
        />

        {/* Build link */}
        <Input
          {...register('buildLink')}
          label="Build Link"
          id="buildLink"
          type="url"
          placeholder="https://erkul.games/..."
          error={errors.buildLink?.message}
        />

        {/* Build site name — only if link is set */}
        {buildLink && (
          <Input
            {...register('buildSiteName')}
            label="Build Site Name"
            id="buildSiteName"
            placeholder="Erkul"
            error={errors.buildSiteName?.message}
          />
        )}

        {/* Acquired date */}
        <Input
          {...register('acquiredAt')}
          label="Acquired Date"
          id="acquiredAt"
          type="date"
          error={errors.acquiredAt?.message}
        />

        {/* Notes */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="notes"
            className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide"
          >
            Notes
          </label>
          <textarea
            {...register('notes')}
            id="notes"
            rows={3}
            placeholder="Optional notes..."
            className="px-3 py-2 bg-bg-elevated border border-border-subtle text-text-primary font-inter text-sm placeholder:text-text-disabled focus:outline-none focus:border-accent-cyan resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2">
          <Button type="submit" variant="primary" size="lg" className="w-full">
            {isEdit ? 'SAVE CHANGES' : 'ADD SHIP'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            CANCEL
          </Button>
          {isEdit && onDelete && (
            <Button
              type="button"
              variant="danger"
              size="md"
              className="w-full mt-2"
              onClick={() => {
                onDelete()
                onOpenChange(false)
              }}
            >
              <Trash2 size={14} className="mr-2" />
              DELETE SHIP
            </Button>
          )}
        </div>
      </form>
    </BottomSheet>
  )
}
