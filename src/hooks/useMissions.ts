import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { AppData, Mission, MissionFormValues, MissionStatus } from '../lib/schema'

interface UseMissionsOptions {
  data: AppData
  update: (next: AppData) => void
}

export function useMissions({ data, update }: UseMissionsOptions) {
  const missions = data.missions ?? []

  const addMission = useCallback(
    (values: MissionFormValues) => {
      const now = new Date().toISOString()
      const mission: Mission = {
        id: uuidv4(),
        title: values.title,
        type: values.type,
        faction: values.faction || undefined,
        payoutUEC: values.payoutUEC,
        status: values.status,
        location: values.location || undefined,
        expiresAt: values.expiresAt || undefined,
        notes: values.notes || undefined,
        createdAt: now,
        updatedAt: now,
      }
      update({ ...data, missions: [...missions, mission] })
      return mission
    },
    [data, update, missions]
  )

  const editMission = useCallback(
    (id: string, values: MissionFormValues) => {
      const now = new Date().toISOString()
      update({
        ...data,
        missions: missions.map((m) =>
          m.id !== id ? m : {
            ...m,
            title: values.title,
            type: values.type,
            faction: values.faction || undefined,
            payoutUEC: values.payoutUEC,
            status: values.status,
            location: values.location || undefined,
            expiresAt: values.expiresAt || undefined,
            notes: values.notes || undefined,
            updatedAt: now,
          }
        ),
      })
    },
    [data, update, missions]
  )

  const setStatus = useCallback(
    (id: string, status: MissionStatus) => {
      update({
        ...data,
        missions: missions.map((m) =>
          m.id !== id ? m : { ...m, status, updatedAt: new Date().toISOString() }
        ),
      })
    },
    [data, update, missions]
  )

  const deleteMission = useCallback(
    (id: string) => {
      update({ ...data, missions: missions.filter((m) => m.id !== id) })
    },
    [data, update, missions]
  )

  return { missions, addMission, editMission, setStatus, deleteMission }
}
