import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { AppData, InventoryItem, InventoryItemFormValues } from '../lib/schema'

interface UseInventoryOptions {
  data: AppData
  update: (next: AppData) => void
}

export function useInventory({ data, update }: UseInventoryOptions) {
  const addItem = useCallback(
    (values: InventoryItemFormValues) => {
      const now = new Date().toISOString()
      const item: InventoryItem = {
        id: uuidv4(),
        name: values.name,
        category: values.category,
        quantity: values.quantity,
        location: values.location,
        priceUEC: values.priceUEC !== '' && values.priceUEC != null ? Number(values.priceUEC) : undefined,
        notes: values.notes || undefined,
        createdAt: now,
        updatedAt: now,
      }
      update({ ...data, inventory: [...(data.inventory ?? []), item] })
      return item
    },
    [data, update]
  )

  const editItem = useCallback(
    (id: string, values: InventoryItemFormValues) => {
      const now = new Date().toISOString()
      update({
        ...data,
        inventory: (data.inventory ?? []).map((item) =>
          item.id !== id
            ? item
            : {
                ...item,
                name: values.name,
                category: values.category,
                quantity: values.quantity,
                location: values.location,
                priceUEC: values.priceUEC !== '' && values.priceUEC != null ? Number(values.priceUEC) : undefined,
                notes: values.notes || undefined,
                updatedAt: now,
              }
        ),
      })
    },
    [data, update]
  )

  const deleteItem = useCallback(
    (id: string) => {
      update({ ...data, inventory: (data.inventory ?? []).filter((item) => item.id !== id) })
    },
    [data, update]
  )

  return { items: data.inventory ?? [], addItem, editItem, deleteItem }
}
