import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Terminal, Shield } from 'lucide-react'

const loadingMessages = [
  "Investigating security threat...",
  "Analyzing security telemetry & audit logs...",
  "Running AI security analysis agents...",
  "Correlating attack indicators & context...",
  "Querying threat intelligence databases...",
  "Mapping tactics to MITRE ATT&CK framework...",
  "Extracting IOCs and network signatures...",
  "Formulating incident mitigation playbook...",
  "Generating executive analyst report...",
  "Securing investigation details in system database..."
]

function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    // Cycle messages every 3.5 seconds
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 3500)

    // Increment timer every second for realistic telemetry tracking
    const timerInterval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(msgInterval)
      clearInterval(timerInterval)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl border border-slate-800 bg-[#111827]/40 p-8 shadow-soc backdrop-blur-md relative overflow-hidden flex flex-col items-center justify-center min-h-[420px] text-center"
    >
      {/* Background cyber grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      
      {/* Glowing accent border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-soc-primary to-transparent animate-pulse" />

      {/* Pulsing Spinner Icon */}
      <div className="relative flex items-center justify-center h-28 w-28 mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-dashed border-soc-primary/20 border-t-soc-primary shadow-cyan-glow"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="h-16 w-16 rounded-2xl bg-soc-primary/10 border border-soc-primary/20 flex items-center justify-center text-soc-primary"
        >
          <Shield className="h-8 w-8 animate-pulse" />
        </motion.div>
      </div>

      <div className="space-y-4 max-w-md relative z-10">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">
          SOC Investigation Active
        </h2>
        
        {/* Animated text carousel */}
        <div className="h-6 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-semibold text-soc-primary tracking-wide font-mono uppercase"
            >
              {loadingMessages[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Loading status bar */}
        <div className="h-1.5 w-64 mx-auto bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "92%"] }}
            transition={{ duration: 35, ease: "easeOut" }}
            className="h-full bg-soc-primary shadow-cyan-glow"
          />
        </div>

        <div className="pt-2">
          <p className="text-xs text-slate-400 font-medium">
            Elapsed Analysis Time: <span className="font-mono text-slate-300 font-bold">{seconds}s</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-2 italic leading-normal">
            Estimated completion: ~15-30 seconds.
            <br />
            Our automated security agents are aggregating telemetry. Please do not refresh.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default LoadingState
