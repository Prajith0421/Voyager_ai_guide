import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div className="h-screen w-full overflow-hidden bg-navy-950">
      <Outlet />
    </div>
  )
}
