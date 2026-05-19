import { NavLink } from 'react-router-dom'
import { IconBookmark, IconHome, IconMap, IconUser } from '../ui/Icons'

const LINKS = [
  { to: '/welcome', label: 'Home', Icon: IconHome, end: true },
  { to: '/explore', label: 'Explore', Icon: IconMap },
  { to: '/saved', label: 'Saved', Icon: IconBookmark },
  { to: '/profile', label: 'Account', Icon: IconUser },
]

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-white/[0.08] bg-surface-1/95 backdrop-blur-2xl">
      <div className="flex justify-around py-2">
        {LINKS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-2 min-w-[64px] rounded-xl transition-colors ${
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
  )
}
