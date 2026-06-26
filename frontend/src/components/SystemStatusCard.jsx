import React from 'react'
import { Server, Database, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'

function SystemStatusCard() {
  const statuses = [
    { label: 'Backend', status: 'Online', icon: Server, color: 'bg-green-500' },
    { label: 'Database', status: 'Connected', icon: Database, color: 'bg-green-500' },
    { label: 'AI Engine', status: 'Ready', icon: Cpu, color: 'bg-green-500' }
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-4 shadow-md relative overflow-hidden"
    >
      {/* Visual Cyan glow stripe on top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-soc-primary/20 via-soc-primary to-soc-primary/20" />
      
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
        System Status
      </h3>
      <div className="space-y-2.5">
        {statuses.map(({ label, status, icon: Icon, color }) => (
          <div key={label} className="flex items-center justify-between py-2 px-2.5 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <div className="flex items-center gap-2.5">
              <Icon className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-300">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${color}`} />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
              </span>
              <span className="text-xs font-mono font-bold text-slate-200">{status}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

export default SystemStatusCard
