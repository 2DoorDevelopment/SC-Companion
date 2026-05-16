import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HangarPage } from './components/hangar/HangarPage'
import { SettingsPage } from './components/settings/SettingsPage'
import { ComingSoon } from './components/layout/ComingSoon'
import { InventoryPage } from './components/inventory/InventoryPage'
import { MiningPage } from './components/mining/MiningPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/hangar" replace />} />
          <Route path="hangar" element={<HangarPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="crafting" element={<ComingSoon module="Crafting" />} />
          <Route path="cargo" element={<ComingSoon module="Cargo" />} />
          <Route path="mining" element={<MiningPage />} />
          <Route path="missions" element={<ComingSoon module="Missions" />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
