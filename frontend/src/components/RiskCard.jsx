import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { motion } from 'framer-motion'

const riskStyles = {
  Critical: { color: '#EF4444', label: 'Critical' },
  High: { color: '#FACC15', label: 'High' },
  Medium: { color: '#22C55E', label: 'Medium' },
  Low: { color: '#22C55E', label: 'Low' }
}

function RiskCard({ risk }) {
  const value = risk?.risk_score ?? 0
  const level = risk?.risk_level ?? 'Unknown'
  const reasons = Array.isArray(risk?.reasons) ? risk.reasons : risk?.reasons ? [risk.reasons] : []
  const style = riskStyles[level] ?? { color: '#00E5FF', label: level }
  const data = [{ name: 'risk', value: Math.min(value, 100), fill: style.color }]

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="rounded-3xl border border-soc-border bg-soc-card p-6 shadow-soc"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Risk Score</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Threat posture</h2>
        </div>
        <span className="rounded-2xl bg-soc-background px-4 py-2 text-sm font-semibold text-slate-100 shadow-inner" style={{ borderColor: '#0f172a', borderWidth: 1, borderStyle: 'solid' }}>
          {style.label}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div className="flex h-64 items-center justify-center">
          <ResponsiveContainer width="100%" height={260}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={data} startAngle={210} endAngle={-30}>
              <RadialBar
                minAngle={15}
                background={{ fill: '#0F172A' }}
                clockWise
                dataKey="value"
                cornerRadius={20}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-soc-border bg-[#111827]/80 p-6">
            <p className="text-sm text-slate-400">Risk score</p>
            <p className="mt-3 text-5xl font-semibold text-slate-100">{value}</p>
          </div>
          <div className="rounded-3xl border border-soc-border bg-[#111827]/80 p-6">
            <p className="text-sm text-slate-400">Risk level</p>
            <p className="mt-3 text-3xl font-semibold" style={{ color: style.color }}>{level}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-soc-border bg-[#111827]/80 p-6">
        <p className="text-sm text-slate-400">Reasons</p>
        {reasons.length > 0 ? (
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            {reasons.map((reason, index) => (
              <li key={`reason-${index}`} className="rounded-2xl border border-soc-border bg-soc-card/90 px-4 py-3">
                {reason}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-400">No reasons provided.</p>
        )}
      </div>
    </motion.section>
  )
}

export default RiskCard
