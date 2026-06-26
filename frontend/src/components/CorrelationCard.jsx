import { motion } from 'framer-motion'
import { AlertTriangle, Clock3, ShieldCheck, Sparkles } from 'lucide-react'
import SectionHeader from './SectionHeader.jsx'
import Timeline from './Timeline.jsx'

function CorrelationCard({ correlation }) {
  const metrics = [
    { label: 'Incident Type', value: correlation?.incident_type ?? 'Unknown', icon: ShieldCheck },
    { label: 'Severity', value: correlation?.severity ?? 'Unknown', icon: AlertTriangle },
    { label: 'Confidence', value: correlation?.confidence ? `${correlation.confidence}%` : 'Unknown', icon: Clock3 }
  ]

  const timelineItems = Array.isArray(correlation?.timeline) ? correlation.timeline : []

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="rounded-3xl border border-soc-border bg-soc-card p-6 shadow-soc"
    >
      <SectionHeader
        title="Correlation & incident flow"
        subtitle="Correlation"
        caption="Validated event relationships and detection summary"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="rounded-3xl border border-soc-border bg-[#111827]/80 p-5">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-soc-background text-soc-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-400">{metric.label}</p>
              <p className="mt-3 text-xl font-semibold text-slate-100">{metric.value}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-soc-border bg-[#111827]/80 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">Summary</p>
            <h3 className="text-lg font-semibold text-slate-100">Investigation conclusion</h3>
          </div>
          <Sparkles className="h-5 w-5 text-soc-primary" />
        </div>
        <p className="text-sm leading-7 text-slate-300">{correlation?.summary ?? 'No correlation summary available.'}</p>
      </div>

      <div className="mt-6 rounded-3xl border border-soc-border bg-[#111827]/80 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">Timeline</p>
            <h3 className="text-lg font-semibold text-slate-100">Event progression</h3>
          </div>
          <Clock3 className="h-5 w-5 text-soc-primary" />
        </div>
        <Timeline items={timelineItems} />
      </div>
    </motion.section>
  )
}

export default CorrelationCard
