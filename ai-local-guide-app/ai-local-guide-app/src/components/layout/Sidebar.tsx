import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppUI } from '../../hooks/useAppUI'
import { useAuth } from '../../hooks/useAuth'
import {
  IconBookmark,
  IconChat,
  IconHome,
  IconLogo,
  IconMap,
  IconUser,
} from '../ui/Icons'

const NAV = [
  { to: '/welcome', label: 'Home', Icon: IconHome, end: true },
  { to: '/explore', label: 'Explore', Icon: IconMap },
  { to: '/saved', label: 'Saved', Icon: IconBookmark },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppUI()
  const { user } = useAuth()
  const navigate = useNavigate()
  const w = sidebarCollapsed ? 72 : 248

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="hidden md:flex flex-col h-screen border-r border-white/[0.06] bg-surface-1/90 backdrop-blur-2xl shrink-0 z-40"
    >
      <div className="flex items-center gap-3 px-4 h-14 border-b border-white/[0.06]">
        <IconLogo className="w-9 h-9 shrink-0" />
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="font-semibold text-[15px] text-white">LocalGuide</p>
              <p className="text-[10px] text-zinc-500 tracking-wide">DESKTOP</p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={toggleSidebar}
          className="ml-auto p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5"
          aria-label="Toggle sidebar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-500/15 text-indigo-300'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
              }`
            }
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            {!sidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive ? 'bg-indigo-500/15 text-indigo-300' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
            }`
          }
        >
          <IconChat className="w-[18px] h-[18px] shrink-0" />
          {!sidebarCollapsed && <span>Assistant</span>}
        </NavLink>
      </nav>

      <div className="p-2 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04]"
        >
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          {!sidebarCollapsed && (
            <div className="text-left min-w-0">
              <p className="text-zinc-200 truncate text-xs font-medium">{user?.email ?? 'Guest'}</p>
              <p className="text-[10px] text-zinc-600">Account</p>
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  )
}
