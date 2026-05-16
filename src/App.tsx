import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HangarPage } from './components/hangar/HangarPage'
import { SettingsPage } from './components/settings/SettingsPage'
import { InventoryPage } from './components/inventory/InventoryPage'
import { MiningPage } from './components/mining/MiningPage'
import { CargoPage } from './components/cargo/CargoPage'
import { MissionsPage } from './components/missions/MissionsPage'
import { CraftingPage } from './components/crafting/CraftingPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/hangar" replace />} />
          <Route path="hangar" element={<HangarPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="crafting" element={<CraftingPage />} />
          <Route path="cargo" element={<CargoPage />} />
          <Route path="mining" element={<MiningPage />} />
          <Route path="missions" element={<MissionsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
