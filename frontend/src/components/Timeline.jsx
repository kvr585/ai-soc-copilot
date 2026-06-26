import { motion } from 'framer-motion'
import { CircleDot, ChevronRight } from 'lucide-react'

function Timeline({ items }) {
  const normalizedItems = Array.isArray(items)
    ? items.map((item) => (typeof item === 'string' ? { description: item } : item))
    : []

  return (
    <div className="space-y-5">
      {normalizedItems.map((item, index) => (
        <motion.div
          key={`${item.description ?? 'step'}-${index}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.35 }}
          className="relative flex gap-4"
        >
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-soc-border bg-soc-background text-soc-primary shadow-soc">
              <CircleDot className="h-4 w-4" />
            </div>
            {index < normalizedItems.length - 1 && <div className="mt-2 h-full w-px bg-soc-border" />}
          </div>
          <div className="flex-1 rounded-3xl border border-soc-border bg-[#111827]/90 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-100">{item.description ?? 'No details available'}</p>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{item.timestamp ?? item.time ?? 'Timestamp unavailable'}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default Timeline
