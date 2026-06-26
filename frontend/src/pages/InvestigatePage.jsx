import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Shield, Cpu, Globe, Flame, Network, ShieldCheck } from 'lucide-react'

import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import SystemStatusCard from '../components/SystemStatusCard.jsx'
import RecentInvestigationsCard from '../components/RecentInvestigationsCard.jsx'
import InvestigationTemplates from '../components/InvestigationTemplates.jsx'
import LoadingState from '../components/LoadingState.jsx'
import SuccessCard from '../components/SuccessCard.jsx'
import InvestigationErrorCard from '../components/InvestigationErrorCard.jsx'
import InvestigationForm from '../components/InvestigationForm.jsx'

import { investigateAlert, getAllInvestigations } from '../services/api.js'

const logSources = [
  { name: 'SSH Logs', icon: Terminal, desc: 'Secure shell daemon auth events' },
  { name: 'Windows Event Logs', icon: Shield, desc: 'Security audit & registry logs' },
  { name: 'Sysmon Logs', icon: Cpu, desc: 'Detailed host system monitor logs' },
  { name: 'Firewall Logs', icon: Flame, desc: 'Network packet filter ingress/egress' },
  { name: 'VPN Logs', icon: Globe, desc: 'Virtual Private Network access events' },
  { name: 'Apache/Nginx Logs', icon: Network, desc: 'HTTP request & server access logs' }
]

function InvestigatePage() {
  const [alert, setAlert] = useState('')
  const [logs, setLogs] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [result, setResult] = useState(null)
  
  const [recentInvestigations, setRecentInvestigations] = useState([])
  const [isLoadingRecent, setIsLoadingRecent] = useState(true)

  // Fetch recent investigations on load
  const loadRecent = async () => {
    setIsLoadingRecent(true)
    try {
      const data = await getAllInvestigations()
      setRecentInvestigations(data || [])
    } catch (err) {
      console.error("Failed to load recent investigations:", err)
    } finally {
      setIsLoadingRecent(false)
    }
  }

  useEffect(() => {
    loadRecent()
  }, [])

  const handleSelectTemplate = (sampleAlert, sampleLogs) => {
    setAlert(sampleAlert)
    setLogs(sampleLogs)
  }

  const handleReset = () => {
    setAlert('')
    setLogs('')
    setResult(null)
    setStatus('idle')
    setErrorMsg('')
  }

  const handleInvestigate = async () => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await investigateAlert({ alert, logs })
      setResult(res)
      setStatus('success')
      // Refresh the recent investigations list
      loadRecent()
    } catch (err) {
      console.error("Investigation failed:", err)
      const friendlyMsg = err.response?.data?.detail || err.message || "An unexpected error occurred in the AI correlation engine."
      setErrorMsg(friendlyMsg)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 font-sans">
      <Navbar backendStatus={{ online: status !== 'error', message: status === 'error' ? 'Offline' : 'Online' }} />

      <div className="mx-auto w-full max-w-none px-6 py-6 xl:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          <Sidebar />

          <main className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr] min-w-0">
            {/* Left Column: Form & States */}
            <div className="space-y-8 min-w-0">
              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.div
                    key="idle-state"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Header Banner */}
                    <div className="relative overflow-hidden glass-card rounded-3xl p-6 shadow-soc">
                      <div className="absolute top-0 left-0 w-24 h-[1px] bg-soc-primary shadow-[0_0_15px_#00E5FF]" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-soc-primary">
                        Incident Investigator
                      </p>
                      <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">
                        Investigate New Incident
                      </h2>
                      <p className="mt-1 text-sm text-slate-400 font-medium">
                        Submit alerts and security logs to launch an AI-powered SOC investigation.
                      </p>
                    </div>

                    {/* Investigation Templates Selection */}
                    <div className="glass-card rounded-2xl p-4 shadow-md border-slate-800/60">
                      <InvestigationTemplates onSelect={handleSelectTemplate} />
                    </div>

                    {/* Form component */}
                    <InvestigationForm
                      alertVal={alert}
                      logsVal={logs}
                      onChangeAlert={setAlert}
                      onChangeLogs={setLogs}
                      onSubmit={handleInvestigate}
                    />
                  </motion.div>
                )}

                {status === 'loading' && (
                  <LoadingState key="loading-state" />
                )}

                {status === 'success' && result && (
                  <SuccessCard
                    key="success-state"
                    result={result}
                    onReset={handleReset}
                  />
                )}

                {status === 'error' && (
                  <InvestigationErrorCard
                    key="error-state"
                    message={errorMsg}
                    onRetry={handleInvestigate}
                    onReturn={() => setStatus('idle')}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Status & Sidebar Info */}
            <div className="space-y-8 min-w-0">
              {/* System Status Card */}
              <SystemStatusCard />

              {/* Supported Log Sources Card */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="glass-card rounded-2xl p-4 shadow-md relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-soc-primary/30 to-transparent" />
                
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Supported Log Sources
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {logSources.map(({ name, icon: Icon, desc }) => (
                    <div
                      key={name}
                      className="p-2.5 rounded-xl border border-slate-800/40 bg-slate-900/10 hover:border-slate-800 hover:bg-slate-900/30 transition group cursor-default"
                      title={desc}
                    >
                      <Icon className="h-4 w-4 text-slate-500 group-hover:text-soc-primary transition-colors mb-1" />
                      <p className="text-[10px] font-bold text-slate-350">{name}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Recent Investigations Card */}
              <RecentInvestigationsCard
                investigations={recentInvestigations}
                isLoading={isLoadingRecent}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default InvestigatePage
