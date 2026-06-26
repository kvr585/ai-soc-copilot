import React, { useState, useEffect } from 'react'
import { Play, RotateCw, Trash2, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import { templates } from './InvestigationTemplates.jsx'

function InvestigationForm({ alertVal, logsVal, onChangeAlert, onChangeLogs, onSubmit, disabled = false }) {
  const [error, setError] = useState('')

  // Auto-clear validation error if alert becomes non-empty
  useEffect(() => {
    if (alertVal.trim()) {
      setError('')
    }
  }, [alertVal])

  const handleClear = () => {
    onChangeAlert('')
    onChangeLogs('')
    setError('')
  }

  const handleLoadSample = () => {
    const sample = templates[0] // Credential Compromise
    onChangeAlert(sample.alert)
    onChangeLogs(sample.logs)
    setError('')
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    
    if (!alertVal.trim()) {
      setError('Alert description is required to launch an investigation.')
      return
    }

    setError('')
    onSubmit()
  }

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-3xl p-6 md:p-8 border-slate-700/60 shadow-soc relative space-y-6"
    >
      <div className="space-y-2">
        <label htmlFor="alert" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Security Alert Brief <span className="text-red-400">*</span>
        </label>
        <textarea
          id="alert"
          rows={3}
          value={alertVal}
          onChange={(e) => onChangeAlert(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="e.g., Multiple failed SSH logins followed by successful login from anomalous country for user root..."
          className={`w-full rounded-xl border bg-slate-950/40 p-4 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-soc-primary transition duration-150 ${
            error ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-800 focus:border-soc-primary/40'
          }`}
        />
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold animate-pulse">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="logs" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Associated Logs <span className="text-slate-600 text-[10px] lowercase italic">(optional)</span>
          </label>
          <span className="text-[10px] text-slate-500 font-medium">Supports multiline logs</span>
        </div>
        <textarea
          id="logs"
          rows={5}
          value={logsVal}
          onChange={(e) => onChangeLogs(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Paste syslog lines, Windows Event Log XML/JSON, VPN connection events, etc."
          className="w-full rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-xs font-mono text-slate-200 placeholder-slate-650 focus:outline-none focus:border-soc-primary/40 focus:ring-1 focus:ring-soc-primary transition duration-150"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-850 pt-4 mt-2">
        <span className="text-[10px] text-slate-500 hidden sm:inline-block font-mono">
          Press <kbd className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-bold text-[9px]">Ctrl + Enter</kbd> to investigate
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={disabled}
            onClick={handleClear}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-350 hover:text-slate-200 px-4 py-2.5 text-xs font-bold transition disabled:opacity-50"
            title="Reset text fields"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={handleLoadSample}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-350 hover:text-slate-200 px-4 py-2.5 text-xs font-bold transition disabled:opacity-50"
            title="Load sample credential compromise alert"
          >
            <RotateCw className="h-3.5 w-3.5 animate-spin-hover" />
            <span>Load Sample</span>
          </button>

          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-soc-primary hover:bg-cyan-300 text-slate-950 px-5 py-2.5 text-xs font-extrabold transition shadow-cyan-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Investigate Alert</span>
          </button>
        </div>
      </div>
    </motion.form>
  )
}

export default InvestigationForm
