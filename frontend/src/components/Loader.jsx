import { motion } from 'framer-motion'

function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-soc-border bg-soc-card p-8 shadow-soc"
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-soc-border">
          <div className="absolute h-14 w-14 rounded-full border-4 border-t-soc-primary border-slate-700 animate-spin" />
        </div>
        <div>
          <p className="text-xl font-semibold text-slate-100">AI Agents Investigating...</p>
          <p className="mt-2 text-sm text-slate-400">Gathering verdicts, threat intelligence, and correlation details.</p>
        </div>
      </div>
    </motion.div>
  )
}

export default Loader
