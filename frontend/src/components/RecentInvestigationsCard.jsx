import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, Clock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

function formatRelativeTime(dateStr) {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.round(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.round(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.round(diffHours / 24)
    return `${diffDays}d ago`
  } catch {
    return dateStr
  }
}

function getSeverityDotColor(severity) {
  const s = String(severity).toLowerCase()
  if (s === 'critical') return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
  if (s === 'high') return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]'
  if (s === 'medium') return 'bg-yellow-500'
  return 'bg-green-500'
}

function RecentInvestigationsCard({ investigations = [], isLoading = false }) {
  const navigate = useNavigate()

  // Display only the latest 5
  const latestInvestigations = investigations.slice(0, 5)

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="glass-card rounded-2xl p-4 shadow-md relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-soc-primary/20 via-soc-primary/50 to-soc-primary/20" />
      
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
        Recent Investigations
      </h3>

      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-slate-900/35 border border-slate-850 animate-pulse" />
          ))}
        </div>
      ) : latestInvestigations.length === 0 ? (
        <div className="text-center py-6">
          <ShieldAlert className="mx-auto h-7 w-7 text-slate-650 mb-1.5" />
          <p className="text-xs text-slate-400 font-semibold">No recent investigations</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {latestInvestigations.map((inv, idx) => {
            const dotColor = getSeverityDotColor(inv.severity)
            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                onClick={() => navigate(`/incidents/${inv.id}`)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-850 bg-slate-900/10 hover:border-slate-800 hover:bg-slate-900/30 transition duration-150 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${dotColor}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold text-soc-primary">{inv.incident_id}</span>
                      <span className="text-[9px] text-slate-600">•</span>
                      <div className="flex items-center gap-0.5 text-[9px] text-slate-500 font-mono">
                        <Clock className="h-2.5 w-2.5" />
                        <span>{formatRelativeTime(inv.created_at)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-250 font-bold truncate mt-0.5 group-hover:text-slate-100 transition-colors" title={inv.incident_type}>
                      {inv.incident_type}
                    </p>
                  </div>
                </div>

                <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 group-hover:text-soc-primary group-hover:border-slate-700 transition shrink-0 ml-2">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.section>
  )
}

export default RecentInvestigationsCard
