import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { BottomSheet } from '../ui/BottomSheet'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Autocomplete } from '../ui/Autocomplete'
import { CargoEntryFormSchema, COMMON_COMMODITIES } from '../../lib/schema'
import type { CargoEntry, CargoEntryFormValues, CargoStatus } from '../../lib/schema'

const STATUS_OPTIONS: { value: CargoStatus; label: string; dot: string }[] = [
  { value: 'bought', label: 'Bought — cargo in hold', dot: 'bg-status-delivery' },
  { value: 'sold', label: 'Sold — run complete', dot: 'bg-status-ready' },
]

const TRADE_LOCATIONS = [
  'Area18', 'Levski', 'Port Olisar', 'Lorville', 'New Babbage', 'Orison',
  'CRU-L1', 'CRU-L5', 'HUR-L1', 'HUR-L2', 'HUR-L3', 'HUR-L4', 'HUR-L5',
  'ARC-L1', 'ARC-L2', 'ARC-L3', 'ARC-L4', 'ARC-L5', 'MIC-L1', 'MIC-L2',
  'Bountiful Harvest Hydroponics', 'Deakins Research', 'GrimHEX',
  'Reclamation & Disposal Orinth', 'TDD Area18', 'TDD Lorville', 'TDD New Babbage',
]

interface CargoEntryFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: CargoEntry
  onSave: (values: CargoEntryFormValues) => void
  onDelete?: () => void
}

export function CargoEntryFormSheet({ open, onOpenChange, entry, onSave, onDelete }: CargoEntryFormSheetProps) {
  const isEdit = Boolean(entry)
  const today = new Date().toISOString().slice(0, 10)

  const { register, handleSubmit, control, watch, reset, formState: { errors } } =
    useForm<CargoEntryFormValues>({
      resolver: zodResolver(CargoEntryFormSchema),
      defaultValues: {
        date: today,
        commodity: '',
        ship: '',
        quantitySCU: 0,
        buyLocation: '',
        buyPricePerSCU: 0,
        status: 'bought',
        sellLocation: '',
        sellPricePerSCU: '',
        notes: '',
      },
    })

  useEffect(() => {
    if (open) {
      if (entry) {
        reset({
          date: entry.date,
          commodity: entry.commodity,
          ship: entry.ship ?? '',
          quantitySCU: entry.quantitySCU,
          buyLocation: entry.buyLocation,
          buyPricePerSCU: entry.buyPricePerSCU,
          status: entry.status,
          sellLocation: entry.sellLocation ?? '',
          sellPricePerSCU: entry.sellPricePerSCU ?? '',
          notes: entry.notes ?? '',
        })
      } else {
        reset({ date: today, commodity: '', ship: '', quantitySCU: 0, buyLocation: '', buyPricePerSCU: 0, status: 'bought', sellLocation: '', sellPricePerSCU: '', notes: '' })
      }
    }
  }, [open, entry, reset, today])

  const status = watch('status')
  const qty = watch('quantitySCU')
  const buyPrice = watch('buyPricePerSCU')
  const sellPrice = watch('sellPricePerSCU')
  const previewProfit = status === 'sold' && sellPrice !== '' && sellPrice != null
    ? (Number(sellPrice) - Number(buyPrice)) * Number(qty)
    : null

  function onSubmit(values: CargoEntryFormValues) {
    onSave(values)
    onOpenChange(false)
  }

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title={isEdit ? 'EDIT RUN' : 'LOG RUN'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-safe">
        <div className="grid grid-cols-2 gap-3">
          <Input {...register('date')} label="Date *" id="cargo-date" type="date" error={errors.date?.message} />
          <Input {...register('ship')} label="Ship" id="cargo-ship" placeholder="Cutlass..." />
        </div>

        <Controller
          name="commodity"
          control={control}
          render={({ field }) => (
            <Autocomplete
              label="Commodity *"
              value={field.value}
              onChange={field.onChange}
              suggestions={COMMON_COMMODITIES}
              placeholder="e.g. Laranite"
              error={errors.commodity?.message}
            />
          )}
        />

        <Input
          {...register('quantitySCU')}
          label="Quantity (SCU) *"
          id="cargo-qty"
          type="number"
          min={0}
          step={1}
          error={errors.quantitySCU?.message}
        />

        {/* Buy side */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide">Buy</span>
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="buyLocation"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  value={field.value}
                  onChange={field.onChange}
                  suggestions={TRADE_LOCATIONS}
                  placeholder="Buy location"
                  error={errors.buyLocation?.message}
                />
              )}
            />
            <Input
              {...register('buyPricePerSCU')}
              label=""
              id="cargo-buy-price"
              type="number"
              min={0}
              placeholder="UEC / SCU"
              error={errors.buyPricePerSCU?.message}
            />
          </div>
        </div>

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
                    <span className={`w-2.5 h-2.5 rounded-full ${opt.dot} flex-shrink-0 ${field.value === opt.value ? 'ring-2 ring-offset-1 ring-offset-bg-elevated ring-current' : ''}`} />
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

        {/* Sell side — only when sold */}
        {status === 'sold' && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide">Sell</span>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="sellLocation"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    suggestions={TRADE_LOCATIONS}
                    placeholder="Sell location"
                  />
                )}
              />
              <Input
                {...register('sellPricePerSCU')}
                label=""
                id="cargo-sell-price"
                type="number"
                min={0}
                placeholder="UEC / SCU"
              />
            </div>
            {previewProfit != null && (
              <div className={`px-3 py-2 border text-sm font-mono text-center ${previewProfit >= 0 ? 'border-status-ready/30 text-status-ready bg-status-ready/5' : 'border-status-destroyed/30 text-status-destroyed bg-status-destroyed/5'}`}>
                {previewProfit >= 0 ? '+' : ''}{previewProfit.toLocaleString()} UEC profit
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="cargo-notes" className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide">Notes</label>
          <textarea {...register('notes')} id="cargo-notes" rows={2} placeholder="Optional notes..." className="px-3 py-2 bg-bg-elevated border border-border-subtle text-text-primary font-inter text-sm placeholder:text-text-disabled focus:outline-none focus:border-accent-cyan resize-none" />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button type="submit" variant="primary" size="lg" className="w-full">{isEdit ? 'SAVE CHANGES' : 'LOG RUN'}</Button>
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => onOpenChange(false)}>CANCEL</Button>
          {isEdit && onDelete && (
            <Button type="button" variant="danger" size="md" className="w-full mt-2" onClick={() => { onDelete(); onOpenChange(false) }}>
              <Trash2 size={14} className="mr-2" /> DELETE RUN
            </Button>
          )}
        </div>
      </form>
    </BottomSheet>
  )
}
