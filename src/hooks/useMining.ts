import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { AppData, MiningRun, MiningRunFormValues } from '../lib/schema'

interface UseMiningOptions {
  data: AppData
  update: (next: AppData) => void
}

export function useMining({ data, update }: UseMiningOptions) {
  const runs = data.mining ?? []

  const addRun = useCallback(
    (values: MiningRunFormValues) => {
      const now = new Date().toISOString()
      const run: MiningRun = {
        id: uuidv4(),
        date: values.date,
        location: values.location,
        method: values.method,
        ship: values.ship || undefined,
        minerals: values.minerals,
        status: values.status,
        refineryLocation: values.refineryLocation || undefined,
        refineStartedAt: values.refineStartedAt || undefined,
        refineReadyAt: values.refineReadyAt || undefined,
        notes: values.notes || undefined,
        createdAt: now,
        updatedAt: now,
      }
      update({ ...data, mining: [...runs, run] })
      return run
    },
    [data, update, runs]
  )

  const editRun = useCallback(
    (id: string, values: MiningRunFormValues) => {
      const now = new Date().toISOString()
      update({
        ...data,
        mining: runs.map((r) =>
          r.id !== id
            ? r
            : {
                ...r,
                date: values.date,
                location: values.location,
                method: values.method,
                ship: values.ship || undefined,
                minerals: values.minerals,
                status: values.status,
                refineryLocation: values.refineryLocation || undefined,
                refineStartedAt: values.refineStartedAt || undefined,
                refineReadyAt: values.refineReadyAt || undefined,
                notes: values.notes || undefined,
                updatedAt: now,
              }
        ),
      })
    },
    [data, update, runs]
  )

  const setStatus = useCallback(
    (id: string, status: MiningRun['status']) => {
      update({
        ...data,
        mining: runs.map((r) =>
          r.id !== id ? r : { ...r, status, updatedAt: new Date().toISOString() }
        ),
      })
    },
    [data, update, runs]
  )

  const deleteRun = useCallback(
    (id: string) => {
      update({ ...data, mining: runs.filter((r) => r.id !== id) })
    },
    [data, update, runs]
  )

  return { runs, addRun, editRun, setStatus, deleteRun }
}
