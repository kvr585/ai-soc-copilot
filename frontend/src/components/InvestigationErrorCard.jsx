import React from 'react'
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

function InvestigationErrorCard({ message, onRetry, onReturn }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl border border-red-500/20 bg-[#111827]/40 p-6 shadow-soc backdrop-blur-md relative overflow-hidden space-y-5"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />

      <div className="flex items-center gap-4 border-b border-slate-850 pb-5">
        <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">System Warning</span>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-100">
            Investigation Failed
          </h2>
        </div>
      </div>

      <p className="text-sm leading-7 text-slate-350">
        {message || 'The backend security correlation engine was unable to complete the analysis. Please verify your logs format and try again.'}
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-2xl bg-red-500 hover:bg-red-400 text-white px-5 py-3 text-sm font-semibold transition"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry Investigation</span>
        </button>
        
        <button
          type="button"
          onClick={onReturn}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/50 hover:bg-slate-800 text-slate-300 border border-slate-800 px-5 py-3 text-sm font-semibold transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Form</span>
        </button>
      </div>
    </motion.div>
  )
}

export default InvestigationErrorCard
