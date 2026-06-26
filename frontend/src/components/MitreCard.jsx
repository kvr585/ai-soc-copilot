import { motion } from 'framer-motion'
import { ShieldAlert, Layers } from 'lucide-react'
import Badge from './Badge.jsx'
import SectionHeader from './SectionHeader.jsx'

function MitreCard({ mitre }) {
  const tactics = Array.isArray(mitre?.tactics) ? mitre.tactics : []
  const techniques = Array.isArray(mitre?.techniques) ? mitre.techniques : []

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="rounded-3xl border border-soc-border bg-soc-card p-6 shadow-soc"
    >
      <SectionHeader title="MITRE ATT&CK" subtitle="Tactics & techniques" caption="Mapped adversary behavior aligned to MITRE ATT&CK." />

      <div className="mb-6 flex flex-wrap gap-3">
        {tactics.length > 0 ? (
          tactics.map((tactic) => <Badge key={tactic} label={tactic} variant="warning" />)
        ) : (
          <Badge label="None Detected" variant="primary" />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {techniques.length > 0 ? (
          techniques.map((technique) => (
            <div key={technique.id ?? technique.name} className="rounded-3xl border border-soc-border bg-[#111827]/80 p-5">
              <div className="mb-3 flex items-center gap-2 text-slate-400">
                <Layers className="h-4 w-4 text-soc-primary" />
                <span className="text-xs uppercase tracking-[0.26em]">{technique.id ?? 'T0000'}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-100">{technique.name ?? 'Unnamed technique'}</h3>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-soc-border bg-[#111827]/80 p-6 text-slate-400">No MITRE techniques detected.</div>
        )}
      </div>
    </motion.section>
  )
}

export default MitreCard
