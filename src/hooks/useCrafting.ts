import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { AppData, CraftingProject, CraftingProjectFormValues } from '../lib/schema'

interface UseCraftingOptions {
  data: AppData
  update: (next: AppData) => void
}

export function useCrafting({ data, update }: UseCraftingOptions) {
  const crafting = data.crafting ?? []

  const addProject = useCallback(
    (values: CraftingProjectFormValues) => {
      const now = new Date().toISOString()
      const project: CraftingProject = {
        id: uuidv4(),
        name: values.name,
        quantity: values.quantity,
        status: values.status,
        materials: values.materials,
        notes: values.notes || undefined,
        createdAt: now,
        updatedAt: now,
      }
      update({ ...data, crafting: [...crafting, project] })
      return project
    },
    [data, update, crafting]
  )

  const editProject = useCallback(
    (id: string, values: CraftingProjectFormValues) => {
      const now = new Date().toISOString()
      update({
        ...data,
        crafting: crafting.map((p) =>
          p.id !== id ? p : {
            ...p,
            name: values.name,
            quantity: values.quantity,
            status: values.status,
            materials: values.materials,
            notes: values.notes || undefined,
            updatedAt: now,
          }
        ),
      })
    },
    [data, update, crafting]
  )

  const deleteProject = useCallback(
    (id: string) => {
      update({ ...data, crafting: crafting.filter((p) => p.id !== id) })
    },
    [data, update, crafting]
  )

  return { crafting, addProject, editProject, deleteProject }
}
