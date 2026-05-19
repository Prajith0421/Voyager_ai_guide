import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { SavedPlacesProvider } from './hooks/useSavedPlaces'
import { LocationProvider } from './hooks/useLocationContext'
import { AppUIProvider } from './hooks/useAppUI'
import ProtectedRoute from './components/auth/ProtectedRoute'
import GuestRoute from './components/auth/GuestRoute'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import SavedPage from './pages/SavedPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SavedPlacesProvider>
          <LocationProvider>
            <AppUIProvider>
              <Routes>
                <Route element={<GuestRoute />}>
                  <Route path="/login" element={<LoginPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/explore" element={<DashboardPage />} />
                    <Route path="/saved" element={<SavedPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Route>

                <Route path="/welcome" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppUIProvider>
          </LocationProvider>
        </SavedPlacesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
