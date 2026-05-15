import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { AppData, Ship, ShipFormValues } from '../lib/schema'

interface UseHangarOptions {
  data: AppData
  update: (next: AppData) => void
}

export function useHangar({ data, update }: UseHangarOptions) {
  const addShip = useCallback(
    (values: ShipFormValues) => {
      const now = new Date().toISOString()
      const ship: Ship = {
        id: uuidv4(),
        name: values.name.trim() || values.model,
        model: values.model,
        manufacturer: values.manufacturer,
        status: values.status,
        location: values.location,
        buildLink: values.buildLink || undefined,
        buildSiteName: values.buildSiteName || undefined,
        notes: values.notes || undefined,
        acquiredAt: values.acquiredAt || undefined,
        createdAt: now,
        updatedAt: now,
      }
      update({ ...data, hangar: [...data.hangar, ship] })
      return ship
    },
    [data, update]
  )

  const editShip = useCallback(
    (id: string, values: ShipFormValues) => {
      const now = new Date().toISOString()
      update({
        ...data,
        hangar: data.hangar.map((s) =>
          s.id !== id
            ? s
            : {
                ...s,
                name: values.name.trim() || values.model,
                model: values.model,
                manufacturer: values.manufacturer,
                status: values.status,
                location: values.location,
                buildLink: values.buildLink || undefined,
                buildSiteName: values.buildSiteName || undefined,
                notes: values.notes || undefined,
                acquiredAt: values.acquiredAt || undefined,
                updatedAt: now,
              }
        ),
      })
    },
    [data, update]
  )

  const deleteShip = useCallback(
    (id: string) => {
      update({ ...data, hangar: data.hangar.filter((s) => s.id !== id) })
    },
    [data, update]
  )

  return { ships: data.hangar, addShip, editShip, deleteShip }
}
