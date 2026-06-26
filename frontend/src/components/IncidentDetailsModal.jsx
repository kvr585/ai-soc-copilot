import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

function SectionRow({ label, value }) {
  return (
    <div className="rounded-3xl border border-soc-border bg-[#111827]/80 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-slate-100">{value || 'No data available'}</p>
    </div>
  )
}

function IncidentDetailsModal({ open, investigation, loading, onClose }) {
  useEffect(() => {
    if (!open) return
    const escapeHandler = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', escapeHandler)
    return () => window.removeEventListener('keydown', escapeHandler)
  }, [open, onClose])

  const formatValue = (value) => {
    if (value == null) return 'None'
    if (typeof value === 'string') return value
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex h-[80vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-[32px] border border-soc-border bg-[#111827] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-center justify-between border-b border-soc-border px-6 py-5">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Investigation Detail</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-100">{investigation?.incident_id ?? 'Incident details'}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-soc-card text-slate-200 transition hover:bg-soc-background"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex min-h-[260px] items-center justify-center text-slate-300">Loading investigation...</div>
              ) : investigation ? (
                <div className="space-y-6">
                  <SectionRow label="Executive Summary" value={formatValue(investigation.summary)} />
                  <SectionRow label="Alert" value={formatValue(investigation.alert)} />
                  <SectionRow label="Logs" value={formatValue(investigation.logs)} />
                  <SectionRow
                    label="Risk Analysis"
                    value={formatValue({
                      severity: investigation.severity || 'Unknown',
                      risk_score: investigation.risk_score ?? 'Unknown',
                      risk_level: investigation.risk_level || 'Unknown'
                    })}
                  />
                  <SectionRow label="Threat Intelligence" value={formatValue(investigation.threat_intelligence)} />
                  <SectionRow label="Correlation" value={formatValue(investigation.correlation)} />
                  <SectionRow label="MITRE ATT&CK" value={formatValue(investigation.mitre)} />
                  <SectionRow label="IOC Extraction" value={formatValue(investigation.iocs)} />
                  <SectionRow label="Response Plan" value={formatValue(investigation.response_plan)} />
                  <SectionRow label="Generated Report" value={formatValue(investigation.report)} />
                </div>
              ) : (
                <div className="flex min-h-[260px] items-center justify-center text-slate-300">No investigation details available.</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default IncidentDetailsModal
