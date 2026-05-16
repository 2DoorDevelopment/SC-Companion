import { z } from 'zod'

export const ShipStatusSchema = z.enum(['ready', 'in_delivery', 'destroyed'])
export type ShipStatus = z.infer<typeof ShipStatusSchema>

export const ShipSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  model: z.string().min(1),
  manufacturer: z.string().min(1),
  status: ShipStatusSchema,
  location: z.string().default(''),
  buildLink: z.string().url().optional().or(z.literal('')),
  buildSiteName: z.string().optional(),
  notes: z.string().optional(),
  acquiredAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Ship = z.infer<typeof ShipSchema>

export const ItemCategorySchema = z.enum([
  'weapon',
  'armor',
  'component',
  'consumable',
  'resource',
  'tool',
  'apparel',
  'misc',
])
export type ItemCategory = z.infer<typeof ItemCategorySchema>

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  weapon: 'Weapon',
  armor: 'Armor',
  component: 'Component',
  consumable: 'Consumable',
  resource: 'Resource',
  tool: 'Tool',
  apparel: 'Apparel',
  misc: 'Misc',
}

export const InventoryItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  category: ItemCategorySchema,
  quantity: z.number().int().min(0).default(1),
  location: z.string().default(''),
  priceUEC: z.number().min(0).optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type InventoryItem = z.infer<typeof InventoryItemSchema>

export const InventoryItemFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: ItemCategorySchema,
  quantity: z.coerce.number().int().min(0, 'Must be 0 or more'),
  location: z.string(),
  priceUEC: z.coerce.number().min(0).optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type InventoryItemFormValues = z.infer<typeof InventoryItemFormSchema>

export const AppDataSchema = z.object({
  schemaVersion: z.literal(1),
  exportedAt: z.string().optional(),
  hangar: z.array(ShipSchema),
  inventory: z.array(InventoryItemSchema).default([]),
  meta: z.object({
    createdAt: z.string(),
    lastModifiedAt: z.string(),
  }),
})

export type AppData = z.infer<typeof AppDataSchema>

export const ShipFormSchema = z.object({
  model: z.string().min(1, 'Ship model is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  name: z.string(),
  status: ShipStatusSchema,
  location: z.string(),
  buildLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  buildSiteName: z.string().optional(),
  acquiredAt: z.string().optional(),
  notes: z.string().optional(),
})

export type ShipFormValues = z.infer<typeof ShipFormSchema>

export const CURRENT_SCHEMA_VERSION = 1 as const
