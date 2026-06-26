import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Eye, Trash2, Calendar, AlertTriangle, ShieldAlert, ArrowRight } from "lucide-react"

// Color mapper for badges
function getSeverityBadgeStyles(sev) {
  const s = String(sev).toLowerCase()
  if (s === 'critical') return 'border-red-500/20 bg-red-500/10 text-red-400'
  if (s === 'high') return 'border-orange-500/20 bg-orange-500/10 text-orange-400'
  if (s === 'medium') return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'
  return 'border-green-500/20 bg-green-500/10 text-green-450'
}

function getRiskLevelStyles(lvl) {
  const l = String(lvl).toLowerCase()
  if (l === 'critical') return 'bg-red-500'
  if (l === 'high') return 'bg-orange-500'
  if (l === 'medium') return 'bg-yellow-500'
  return 'bg-green-500'
}

// Risk Score Progress bar component
function RiskProgressBar({ score }) {
  const num = parseInt(score, 10) || 0
  let color = 'bg-soc-success'
  if (num > 70) color = 'bg-soc-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]'
  else if (num > 35) color = 'bg-soc-warning shadow-[0_0_8px_rgba(250,204,21,0.5)]'

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800 shrink-0 hidden sm:block">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min(num, 100)}%` }} />
      </div>
      <span className="font-mono text-xs font-bold text-slate-350">{num}</span>
    </div>
  )
}

function IncidentTable({ investigations = [], onDelete, isDashboardWidget = false }) {
  const navigate = useNavigate()

  // ----------------------------------------------------
  // Dashboard Compact Widget Render
  // ----------------------------------------------------
  if (isDashboardWidget) {
    return (
      <div className="space-y-2">
        {investigations.map((inv, index) => {
          const badgeDot = getRiskLevelStyles(inv.risk_level)
          return (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="flex items-center justify-between p-3 rounded-2xl border border-slate-800/40 bg-slate-900/10 hover:border-slate-850 hover:bg-slate-900/40 transition duration-200 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${badgeDot}`} />
                <div className="min-w-0">
                  <p className="text-[10px] font-mono font-bold text-soc-primary">{inv.incident_id}</p>
                  <p className="text-xs text-slate-300 font-semibold truncate mt-0.5" title={inv.incident_type}>
                    {inv.incident_type}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/incidents/${inv.id}`)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 group-hover:text-soc-primary group-hover:border-slate-700 transition"
                title="Investigate incident details"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </div>
    )
  }

  // ----------------------------------------------------
  // Repository Full Table Render
  // ----------------------------------------------------
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]/25 shadow-soc backdrop-blur-md"
    >
      <div className="overflow-x-auto">
        {investigations.length === 0 ? (
          <div className="py-16 text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">No Investigations Found</h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto">
              No matching records exist. Clear your filter keywords or wait for new security threat alerts.
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-sm text-slate-200">
            <thead>
              <tr className="border-b border-slate-800 text-slate-450 bg-[#111827]/40">
                <th className="py-4.5 px-6 font-bold uppercase tracking-wider text-[10px]">Incident ID</th>
                <th className="py-4.5 px-6 font-bold uppercase tracking-wider text-[10px]">Incident Type</th>
                <th className="py-4.5 px-6 font-bold uppercase tracking-wider text-[10px]">Severity</th>
                <th className="py-4.5 px-6 font-bold uppercase tracking-wider text-[10px]">Risk Score</th>
                <th className="py-4.5 px-6 font-bold uppercase tracking-wider text-[10px]">Risk Level</th>
                <th className="py-4.5 px-6 font-bold uppercase tracking-wider text-[10px] hidden md:table-cell">Created At</th>
                <th className="py-4.5 px-6 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-850 bg-[#111827]/10">
              {investigations.map((investigation, idx) => {
                const severityStyle = getSeverityBadgeStyles(investigation.severity)
                const riskLevelDot = getRiskLevelStyles(investigation.risk_level)

                return (
                  <motion.tr
                    key={investigation.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.02 }}
                    className="hover:bg-slate-900/45 border-b border-slate-850/40 last:border-b-0 transition duration-150 group"
                  >
                    {/* ID */}
                    <td className="py-[18px] px-6 font-mono font-bold text-soc-primary align-middle">
                      {investigation.incident_id}
                    </td>

                    {/* Incident Type */}
                    <td className="py-[18px] px-6 font-semibold text-slate-200 align-middle">
                      {investigation.incident_type}
                    </td>

                    {/* Severity Pill */}
                    <td className="py-[18px] px-6 align-middle">
                      <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${severityStyle}`}>
                        {investigation.severity}
                      </span>
                    </td>

                    {/* Risk Score Progress Bar */}
                    <td className="py-[18px] px-6 align-middle">
                      <RiskProgressBar score={investigation.risk_score} />
                    </td>

                    {/* Risk Level Badge */}
                    <td className="py-[18px] px-6 align-middle">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${riskLevelDot}`} />
                        <span className="text-slate-300 font-semibold">{investigation.risk_level}</span>
                      </div>
                    </td>

                    {/* Created At Date */}
                    <td className="py-[18px] px-6 text-slate-400 hidden md:table-cell align-middle">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <Calendar className="h-3.5 w-3.5 text-slate-550" />
                        <span>
                          {new Date(investigation.created_at).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Actions Panel */}
                    <td className="py-[18px] px-6 text-right align-middle">
                      <div className="flex justify-end gap-2">
                        {/* View Button */}
                        <button
                          type="button"
                          onClick={() => navigate(`/incidents/${investigation.id}`)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-soc-primary hover:border-soc-primary/30 transition shadow-inner"
                          title="View detailed analytical report"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => onDelete(investigation.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/60 border border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-500/20 transition"
                          title="Delete investigation records"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </motion.section>
  )
}

export default IncidentTable