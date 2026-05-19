import { NavLink } from 'react-router-dom'
import {
  IconBookmark,
  IconChat,
  IconHome,
  IconLogo,
  IconMap,
  IconUser,
} from './ui/Icons'

const links = [
  { to: '/', label: 'Home', Icon: IconHome },
  { to: '/map', label: 'Explore', Icon: IconMap },
  { to: '/chat', label: 'Assistant', Icon: IconChat },
  { to: '/saved', label: 'Saved', Icon: IconBookmark },
  { to: '/profile', label: 'Account', Icon: IconUser },
]

export default function Navbar() {
  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[240px] flex-col border-r border-white/[0.06] bg-zinc-950/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/[0.06]">
          <IconLogo className="w-9 h-9" />
          <div>
            <p className="font-semibold text-white text-[15px] leading-tight">Local Guide</p>
            <p className="text-[11px] text-zinc-500">AI-powered discovery</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-300'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/[0.06]">
          <p className="text-[11px] text-zinc-600">Powered by OpenStreetMap</p>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-zinc-950/95 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-2">
          {links.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl min-w-[56px] transition-colors ${
                  isActive ? 'text-indigo-400' : 'text-zinc-500'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
