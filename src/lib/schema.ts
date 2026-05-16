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

// ── Mining ────────────────────────────────────────────────────────────────────

export const MiningMethodSchema = z.enum(['ship', 'fps', 'vehicle'])
export type MiningMethod = z.infer<typeof MiningMethodSchema>

export const MiningStatusSchema = z.enum(['raw', 'refining', 'ready', 'collected'])
export type MiningStatus = z.infer<typeof MiningStatusSchema>

export const MINING_METHOD_LABELS: Record<MiningMethod, string> = {
  ship: 'Ship Mining',
  fps: 'FPS Mining',
  vehicle: 'ROC Mining',
}

export const MINING_STATUS_LABELS: Record<MiningStatus, string> = {
  raw: 'Raw',
  refining: 'Refining',
  ready: 'Ready',
  collected: 'Collected',
}

export const COMMON_MINERALS = [
  'Quantanium', 'Bexalite', 'Taranite', 'Borase', 'Laranite',
  'Gold', 'Diamond', 'Agricium', 'Hephaestanite', 'Stileron',
  'Copper', 'Titanium', 'Corundum', 'Beryl', 'Aphorite', 'Hadanite',
]

export const MineralYieldSchema = z.object({
  mineral: z.string().min(1),
  quantitySCU: z.coerce.number().min(0),
})
export type MineralYield = z.infer<typeof MineralYieldSchema>

export const MiningRunSchema = z.object({
  id: z.string().uuid(),
  date: z.string(),
  location: z.string().min(1),
  method: MiningMethodSchema,
  ship: z.string().optional(),
  minerals: z.array(MineralYieldSchema).default([]),
  status: MiningStatusSchema,
  refineryLocation: z.string().optional(),
  refineStartedAt: z.string().optional(),
  refineReadyAt: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type MiningRun = z.infer<typeof MiningRunSchema>

export const MiningRunFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  method: MiningMethodSchema,
  ship: z.string().optional(),
  minerals: z.array(MineralYieldSchema),
  status: MiningStatusSchema,
  refineryLocation: z.string().optional(),
  refineStartedAt: z.string().optional(),
  refineReadyAt: z.string().optional(),
  notes: z.string().optional(),
})
export type MiningRunFormValues = z.infer<typeof MiningRunFormSchema>

// ── Cargo / Trade ─────────────────────────────────────────────────────────────

export const CargoStatusSchema = z.enum(['bought', 'sold'])
export type CargoStatus = z.infer<typeof CargoStatusSchema>

export const CARGO_STATUS_LABELS: Record<CargoStatus, string> = {
  bought: 'Bought',
  sold: 'Sold',
}

export const COMMON_COMMODITIES = [
  'Agricultural Supplies', 'Aluminum', 'Astatine', 'Beryl', 'Biostics',
  'Carbon', 'Chlorine', 'Compboard', 'Copper', 'Diamond', 'Distilled Spirits',
  'Dolivine', 'Dymantium', 'E\'tam', 'Fluorine', 'Gold', 'Helium', 'Hydrogen',
  'Laranite', 'Medical Supplies', 'Neon', 'Ostamine', 'Processed Food',
  'Quantanium', 'Recycled Material Composite', 'Revenant Tree Pollen',
  'Scrap', 'Stims', 'Taranite', 'Titanium', 'Tungsten', 'WiDoW',
]

export const CargoEntrySchema = z.object({
  id: z.string().uuid(),
  date: z.string(),
  commodity: z.string().min(1),
  ship: z.string().optional(),
  quantitySCU: z.number().min(0),
  buyLocation: z.string().min(1),
  buyPricePerSCU: z.number().min(0),
  status: CargoStatusSchema,
  sellLocation: z.string().optional(),
  sellPricePerSCU: z.number().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type CargoEntry = z.infer<typeof CargoEntrySchema>

export const CargoEntryFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  commodity: z.string().min(1, 'Commodity is required'),
  ship: z.string().optional(),
  quantitySCU: z.coerce.number().min(0, 'Must be 0 or more'),
  buyLocation: z.string().min(1, 'Buy location is required'),
  buyPricePerSCU: z.coerce.number().min(0, 'Must be 0 or more'),
  status: CargoStatusSchema,
  sellLocation: z.string().optional(),
  sellPricePerSCU: z.coerce.number().min(0).optional().or(z.literal('')),
  notes: z.string().optional(),
})
export type CargoEntryFormValues = z.infer<typeof CargoEntryFormSchema>

export function cargoProfit(entry: CargoEntry): number | null {
  if (entry.status !== 'sold' || entry.sellPricePerSCU == null) return null
  return (entry.sellPricePerSCU - entry.buyPricePerSCU) * entry.quantitySCU
}

export const AppDataSchema = z.object({
  schemaVersion: z.literal(1),
  exportedAt: z.string().optional(),
  hangar: z.array(ShipSchema),
  inventory: z.array(InventoryItemSchema).default([]),
  mining: z.array(MiningRunSchema).default([]),
  cargo: z.array(CargoEntrySchema).default([]),
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
