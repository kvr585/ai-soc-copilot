import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, ArrowRight, Home, RefreshCw, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

function getSeverityBadgeStyles(sev) {
  const s = String(sev).toLowerCase()
  if (s === 'critical') return 'border-red-500/20 bg-red-500/10 text-red-400'
  if (s === 'high') return 'border-orange-500/20 bg-orange-500/10 text-orange-400'
  if (s === 'medium') return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'
  return 'border-green-500/20 bg-green-500/10 text-green-400'
}

function getRiskLevelBg(lvl) {
  const l = String(lvl).toLowerCase()
  if (l === 'critical') return 'bg-red-500'
  if (l === 'high') return 'bg-orange-500'
  if (l === 'medium') return 'bg-yellow-500'
  return 'bg-green-500'
}

function SuccessCard({ result, onReset }) {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)
  const [redirectCanceled, setRedirectCanceled] = useState(false)

  useEffect(() => {
    if (redirectCanceled) return

    if (countdown === 0) {
      navigate(`/incidents/${result.id}`)
      return
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, navigate, result.id, redirectCanceled])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-slate-800 bg-[#111827]/40 p-6 shadow-soc backdrop-blur-md relative overflow-hidden space-y-6"
    >
      {/* Glow highlight */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent" />
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-850 pb-5">
        <div className="h-12 w-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-400">Analysis Complete</span>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-100">
            Investigation Complete
          </h2>
        </div>
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="p-3.5 rounded-2xl border border-slate-850 bg-slate-900/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Incident ID</span>
          <p className="mt-1 font-mono text-sm font-bold text-soc-primary">{result.incident_id}</p>
        </div>
        <div className="p-3.5 rounded-2xl border border-slate-850 bg-slate-900/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Severity</span>
          <div className="mt-1">
            <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getSeverityBadgeStyles(result.severity)}`}>
              {result.severity}
            </span>
          </div>
        </div>
        <div className="p-3.5 rounded-2xl border border-slate-850 bg-slate-900/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Risk Score</span>
          <p className="mt-1 text-sm font-extrabold text-slate-200">{result.risk_score} / 100</p>
        </div>
        <div className="p-3.5 rounded-2xl border border-slate-850 bg-slate-900/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Risk Level</span>
          <div className="mt-1.5 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${getRiskLevelBg(result.risk_level)}`} />
            <span className="text-xs font-semibold text-slate-300">{result.risk_level}</span>
          </div>
        </div>
      </div>

      {/* Summary briefing */}
      <div className="p-4 rounded-2xl border border-slate-850 bg-slate-900/20">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Executive Summary</span>
        <p className="mt-2 text-sm leading-6 text-slate-300 font-medium">{result.summary}</p>
      </div>

      {/* Action controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/incidents/${result.id}`)}
            className="inline-flex items-center gap-2 rounded-2xl bg-soc-primary hover:bg-cyan-300 text-slate-950 px-5 py-3 text-sm font-bold transition shadow-cyan-glow"
          >
            <span>View Investigation</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/50 hover:bg-slate-800 text-slate-300 border border-slate-800 px-5 py-3 text-sm font-semibold transition"
          >
            <Home className="h-4 w-4" />
            <span>Go Dashboard</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/50 hover:bg-slate-800 text-slate-300 border border-slate-800 px-5 py-3 text-sm font-semibold transition"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Start New</span>
          </button>
        </div>

        {/* Cancelable auto redirect countdown */}
        {!redirectCanceled && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/40 border border-slate-800/40 text-xs text-slate-400">
            <span>Redirecting in <strong className="text-soc-primary font-mono">{countdown}s</strong>...</span>
            <button
              type="button"
              onClick={() => setRedirectCanceled(true)}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 font-bold tracking-tight uppercase text-[9px]"
              title="Stop auto-redirection"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default SuccessCard
export { getSeverityBadgeStyles }
