import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { AppData, CargoEntry, CargoEntryFormValues } from '../lib/schema'

interface UseCargoOptions {
  data: AppData
  update: (next: AppData) => void
}

export function useCargo({ data, update }: UseCargoOptions) {
  const entries = data.cargo ?? []

  const addEntry = useCallback(
    (values: CargoEntryFormValues) => {
      const now = new Date().toISOString()
      const entry: CargoEntry = {
        id: uuidv4(),
        date: values.date,
        commodity: values.commodity,
        ship: values.ship || undefined,
        quantitySCU: values.quantitySCU,
        buyLocation: values.buyLocation,
        buyPricePerSCU: values.buyPricePerSCU,
        status: values.status,
        sellLocation: values.sellLocation || undefined,
        sellPricePerSCU:
          values.sellPricePerSCU !== '' && values.sellPricePerSCU != null
            ? Number(values.sellPricePerSCU)
            : undefined,
        notes: values.notes || undefined,
        createdAt: now,
        updatedAt: now,
      }
      update({ ...data, cargo: [...entries, entry] })
      return entry
    },
    [data, update, entries]
  )

  const editEntry = useCallback(
    (id: string, values: CargoEntryFormValues) => {
      const now = new Date().toISOString()
      update({
        ...data,
        cargo: entries.map((e) =>
          e.id !== id
            ? e
            : {
                ...e,
                date: values.date,
                commodity: values.commodity,
                ship: values.ship || undefined,
                quantitySCU: values.quantitySCU,
                buyLocation: values.buyLocation,
                buyPricePerSCU: values.buyPricePerSCU,
                status: values.status,
                sellLocation: values.sellLocation || undefined,
                sellPricePerSCU:
                  values.sellPricePerSCU !== '' && values.sellPricePerSCU != null
                    ? Number(values.sellPricePerSCU)
                    : undefined,
                notes: values.notes || undefined,
                updatedAt: now,
              }
        ),
      })
    },
    [data, update, entries]
  )

  const deleteEntry = useCallback(
    (id: string) => {
      update({ ...data, cargo: entries.filter((e) => e.id !== id) })
    },
    [data, update, entries]
  )

  return { entries, addEntry, editEntry, deleteEntry }
}
