import { motion } from 'framer-motion'
import SearchBar from '../search/SearchBar'

export default function DashboardSearch() {
  return (
    <section className="relative z-10 shrink-0 px-4 py-2 max-w-3xl mx-auto w-full">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-xs font-medium text-slate-500 mb-2 tracking-wide"
      >
        Discover any city — powered by live map intelligence
      </motion.p>
      <SearchBar large centered />
    </section>
  )
}
