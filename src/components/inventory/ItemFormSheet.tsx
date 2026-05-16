import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { BottomSheet } from '../ui/BottomSheet'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { InventoryItemFormSchema, CATEGORY_LABELS } from '../../lib/schema'
import type { InventoryItem, InventoryItemFormValues, ItemCategory } from '../../lib/schema'

const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABELS) as ItemCategory[]).map((k) => ({
  value: k,
  label: CATEGORY_LABELS[k],
}))

interface ItemFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: InventoryItem
  onSave: (values: InventoryItemFormValues) => void
  onDelete?: () => void
}

export function ItemFormSheet({ open, onOpenChange, item, onSave, onDelete }: ItemFormSheetProps) {
  const isEdit = Boolean(item)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InventoryItemFormValues>({
    resolver: zodResolver(InventoryItemFormSchema),
    defaultValues: {
      name: '',
      category: 'misc',
      quantity: 1,
      location: '',
      priceUEC: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (item) {
        reset({
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          location: item.location,
          priceUEC: item.priceUEC ?? '',
          notes: item.notes ?? '',
        })
      } else {
        reset({ name: '', category: 'misc', quantity: 1, location: '', priceUEC: '', notes: '' })
      }
    }
  }, [open, item, reset])

  function onSubmit(values: InventoryItemFormValues) {
    onSave(values)
    onOpenChange(false)
  }

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title={isEdit ? 'EDIT ITEM' : 'ADD ITEM'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-safe">
        <Input
          {...register('name')}
          label="Item Name *"
          id="item-name"
          placeholder="e.g. Kastak Arms Ravager-212"
          error={errors.name?.message}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Category *"
              id="item-category"
              options={CATEGORY_OPTIONS}
              error={errors.category?.message}
            />
          )}
        />

        <Input
          {...register('quantity')}
          label="Quantity *"
          id="item-quantity"
          type="number"
          min={0}
          error={errors.quantity?.message}
        />

        <Input
          {...register('location')}
          label="Location"
          id="item-location"
          placeholder="Port Olisar, Stash..."
          error={errors.location?.message}
        />

        <Input
          {...register('priceUEC')}
          label="Price (UEC)"
          id="item-price"
          type="number"
          min={0}
          placeholder="0"
          error={errors.priceUEC?.message}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="item-notes" className="text-xs font-inter font-medium text-text-secondary uppercase tracking-wide">
            Notes
          </label>
          <textarea
            {...register('notes')}
            id="item-notes"
            rows={3}
            placeholder="Optional notes..."
            className="px-3 py-2 bg-bg-elevated border border-border-subtle text-text-primary font-inter text-sm placeholder:text-text-disabled focus:outline-none focus:border-accent-cyan resize-none"
          />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button type="submit" variant="primary" size="lg" className="w-full">
            {isEdit ? 'SAVE CHANGES' : 'ADD ITEM'}
          </Button>
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => onOpenChange(false)}>
            CANCEL
          </Button>
          {isEdit && onDelete && (
            <Button
              type="button"
              variant="danger"
              size="md"
              className="w-full mt-2"
              onClick={() => { onDelete(); onOpenChange(false) }}
            >
              <Trash2 size={14} className="mr-2" />
              DELETE ITEM
            </Button>
          )}
        </div>
      </form>
    </BottomSheet>
  )
}
