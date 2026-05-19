import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { LocationProvider } from './hooks/useLocationContext'
import { AppUIProvider } from './hooks/useAppUI'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import SavedPage from './pages/SavedPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <AppUIProvider>
            <Routes>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/explore" element={<DashboardPage />} />
                <Route path="/saved" element={<SavedPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              <Route path="/welcome" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppUIProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
