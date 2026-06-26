import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import {
  ArrowLeft,
  ShieldAlert,
  FileDown,
  Calendar,
  AlertTriangle,
  Layers,
  Activity,
  Globe,
  MapPin,
  ServerCog,
  ShieldCheck,
  Terminal,
  Cpu,
  Bookmark,
  Library,
  Copy,
  Check,
  Search,
  ExternalLink,
  Clock,
  User,
  Wrench,
  Sparkles,
  SearchCode,
  ShieldAlert as AlertIcon,
  Key,
  Network
} from "lucide-react"

import Navbar from "../components/Navbar.jsx"
import Sidebar from "../components/Sidebar.jsx"
import Loader from "../components/Loader.jsx"
import ErrorCard from "../components/ErrorCard.jsx"

import { getInvestigation } from "../services/api.js"

// Severity Badge Styling Helper
function getSeverityBadgeStyles(sev) {
  const s = String(sev).toLowerCase()
  if (s === 'critical') return 'border-red-500/20 bg-red-500/10 text-red-400'
  if (s === 'high') return 'border-orange-500/20 bg-orange-500/10 text-orange-400'
  if (s === 'medium') return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'
  return 'border-green-500/20 bg-green-500/10 text-green-400'
}

function getSeverityDotColor(sev) {
  const s = String(sev).toLowerCase()
  if (s === 'critical') return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
  if (s === 'high') return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]'
  if (s === 'medium') return 'bg-yellow-500'
  return 'bg-green-500'
}

// 1. Animated Circular Risk Gauge SVG Component
function CircularRiskGauge({ score, level }) {
  const percentage = Math.min(Math.max(parseInt(score, 10) || 0, 0), 100)
  const strokeWidth = 10
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  let glowColor = 'rgba(34, 197, 94, 0.3)'
  let gradientId = 'gauge-green'
  if (percentage > 70) {
    glowColor = 'rgba(239, 68, 68, 0.3)'
    gradientId = 'gauge-red'
  } else if (percentage > 35) {
    glowColor = 'rgba(250, 204, 21, 0.3)'
    gradientId = 'gauge-yellow'
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg className="h-36 w-36 transform -rotate-90">
        <defs>
          <linearGradient id="gauge-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gauge-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="gauge-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
        {/* Outer dotted scanning ring */}
        <circle
          cx="72"
          cy="72"
          r="64"
          stroke="#1F2937"
          strokeWidth="1"
          strokeDasharray="4,4"
          fill="transparent"
          className="animate-[spin_40s_linear_infinite]"
        />
        {/* Background Track */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.3}
        />
        {/* Progress Ring with Framer Motion */}
        <motion.circle
          cx="72"
          cy="72"
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
          style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-4xl font-extrabold tracking-tighter text-slate-100 font-mono"
        >
          {percentage}
        </motion.span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">{level}</span>
      </div>
    </div>
  )
}

// 2. Live Filtering Terminal Style Log Viewer Component
function HackerConsoleLogs({ logs }) {
  const [filterText, setFilterText] = useState("")
  const [copied, setCopied] = useState(false)

  if (!logs) return <p className="text-xs text-slate-500 italic">No telemetry console logs recorded.</p>

  const lines = logs.split("\n")
  const filteredLines = lines.filter((line) =>
    line.toLowerCase().includes(filterText.toLowerCase())
  )

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Color text keywords dynamically
  const formatTerminalLine = (text) => {
    let html = text
    html = html.replace(/(Failed|Failure|error|critical|alert|denied)/gi, '<span class="text-red-400 font-bold">$1</span>')
    html = html.replace(/(Success|Successful|connected|allow|allowlist|permit)/gi, '<span class="text-green-400 font-semibold">$1</span>')
    html = html.replace(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g, '<span class="text-cyan-400 underline select-all">$1</span>')
    html = html.replace(/(powershell\.exe|cmd\.exe|powershell|bash|wscript\.exe|curl|wget)/gi, '<span class="text-yellow-400 font-semibold">$1</span>')
    return <span dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 overflow-hidden shadow-2xl font-mono">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900/80 border-b border-slate-800/60 px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">telemetry_terminal_buffer.log</span>
        </div>

        {/* Live Filter & Copy controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-[10px] text-slate-500 font-mono">
            {filteredLines.length} / {lines.length} entries
          </div>
          
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search log buffer..."
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-350 focus:outline-none focus:border-soc-primary/50 w-full sm:w-44 font-mono"
            />
          </div>

          <button
            onClick={handleCopyLogs}
            className="flex items-center justify-center gap-1 bg-[#111827] border border-slate-800 hover:bg-slate-900 px-3 py-1.5 rounded-lg text-xs text-slate-450 hover:text-slate-200 transition font-mono"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-soc-success animate-pulse" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Logs</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal Lines Container */}
      <div className="p-4 overflow-x-auto max-h-[360px] text-xs leading-relaxed text-slate-300 font-mono scrollbar-thin">
        <table className="w-full text-left border-collapse font-mono">
          <tbody>
            {filteredLines.length > 0 ? (
              filteredLines.map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-900/30 font-mono">
                  <td className="w-8 select-none text-slate-700 pr-4 text-right border-r border-slate-800/40 font-mono text-[10px]">
                    {idx + 1}
                  </td>
                  <td className="pl-4 font-mono whitespace-pre text-slate-350 tracking-tight">
                    {formatTerminalLine(line)}
                    {idx === filteredLines.length - 1 && (
                      <span className="inline-block w-1.5 h-3.5 ml-1 bg-soc-primary animate-pulse" />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="w-8 border-r border-slate-800/40" />
                <td className="pl-4 italic text-slate-650 py-2">No matching log entries found for "{filterText}"</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 3. Tabbed IOC Category Component with Click-to-Copy
function IOCTabs({ iocs }) {
  const [activeTab, setActiveTab] = useState("ips")
  const [copiedIndex, setCopiedIndex] = useState(null)

  const categories = [
    { key: "ips", label: "IPs", count: iocs?.ips?.length || 0, icon: Globe },
    { key: "users", label: "Users", count: iocs?.users?.length || 0, icon: User },
    { key: "domains", label: "Domains", count: iocs?.domains?.length || 0, icon: Network },
    { key: "urls", label: "URLs", count: iocs?.urls?.length || 0, icon: ExternalLink },
    { key: "hashes", label: "Hashes", count: iocs?.hashes?.length || 0, icon: SearchCode },
  ]

  const activeList = iocs?.[activeTab] || []

  const handleCopyItem = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="rounded-2xl border border-slate-800/85 bg-[#111827]/10 p-4.5 space-y-4 glass-card">
      {/* Category Navigation tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-800 pb-2.5">
        {categories.map((cat) => {
          const TabIcon = cat.icon
          return (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                activeTab === cat.key
                  ? "bg-soc-primary/10 text-soc-primary border border-soc-primary/20 shadow-cyan-glow"
                  : "text-slate-500 hover:text-slate-350 border border-transparent"
              }`}
            >
              <TabIcon className="h-3.5 w-3.5" />
              <span>{cat.label} ({cat.count})</span>
            </button>
          )
        })}
      </div>
      
      {/* Tab Panel */}
      <div className="min-h-[64px]">
        {activeList.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {activeList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-soc-primary/40 hover:bg-slate-900/20 transition duration-200 group"
              >
                <span className="font-mono text-xs text-slate-200 select-all truncate pr-2 font-bold tracking-tight">
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyItem(item, idx)}
                  className="p-1 rounded bg-[#111827] border border-slate-800 text-slate-450 hover:text-soc-primary hover:border-slate-700 transition shrink-0 ml-1"
                  title="Copy indicator to clipboard"
                >
                  {copiedIndex === idx ? (
                    <Check className="h-3 w-3 text-soc-success animate-pulse" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic pl-1 py-3">No indicators detected in this category.</p>
        )}
      </div>
    </div>
  )
}

// 4. Interactive Response Playbook cards with status checkmarks
function ResponsePlaybookCards({ plan }) {
  const [checkedItems, setCheckedItems] = useState({})

  const categories = [
    { key: "containment", label: "Containment Response", items: plan?.containment || [], color: "from-red-500/10 via-red-950/5 to-transparent border-red-500/20 text-red-400" },
    { key: "eradication", label: "Eradication Response", items: plan?.eradication || [], color: "from-orange-500/10 via-orange-950/5 to-transparent border-orange-500/20 text-orange-400" },
    { key: "recovery", label: "Recovery Actions", items: plan?.recovery || [], color: "from-green-500/10 via-green-950/5 to-transparent border-green-500/20 text-green-400" },
    { key: "recommendations", label: "Security Recommendations", items: plan?.recommendations || [], color: "from-cyan-500/10 via-cyan-950/5 to-transparent border-cyan-500/20 text-soc-primary" }
  ]

  const handleToggle = (stage, idx) => {
    const key = `${stage}-${idx}`
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {categories.map((cat) => {
        const totalItems = cat.items.length
        const completedItems = cat.items.filter((_, idx) => !!checkedItems[`${cat.key}-${idx}`]).length
        const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

        return (
          <div
            key={cat.key}
            className={`rounded-2xl border bg-gradient-to-br ${cat.color} bg-slate-900/10 p-5 shadow-sm relative overflow-hidden glass-card`}
          >
            <div className="flex flex-col gap-1.5 border-b border-slate-800/60 pb-3 mb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                  {cat.label}
                </h4>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  {completedItems} / {totalItems} completed
                </span>
              </div>
              
              {/* Playbook completion progress bar */}
              {totalItems > 0 && (
                <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full rounded-full transition-all duration-350"
                    style={{ 
                      width: `${progressPercentage}%`,
                      backgroundColor: cat.key === 'containment' ? '#EF4444' : cat.key === 'eradication' ? '#F97316' : cat.key === 'recovery' ? '#22C55E' : '#00E5FF'
                    }}
                  />
                </div>
              )}
            </div>

            {totalItems > 0 ? (
              <div className="space-y-3">
                {cat.items.map((item, idx) => {
                  const isChecked = !!checkedItems[`${cat.key}-${idx}`]
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggle(cat.key, idx)}
                      className="flex items-start gap-2.5 cursor-pointer group"
                    >
                      <button
                        type="button"
                        className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center transition shrink-0 ${
                          isChecked
                            ? "bg-soc-success border-soc-success text-slate-950"
                            : "border-slate-800 bg-slate-950/50 group-hover:border-slate-700"
                        }`}
                      >
                        {isChecked && <Check className="h-3 w-3 font-extrabold text-[#0B1220]" />}
                      </button>
                      <p className={`text-xs leading-relaxed transition duration-155 ${
                        isChecked ? 'text-slate-550 line-through' : 'text-slate-350 group-hover:text-slate-200'
                      }`}>
                        {item}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-650 italic py-2">No response items recommended for this stage.</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

// 5. MITRE ATT&CK Tactic-Technique Map Flow View
function MitreAttackSection({ mitre }) {
  const tactics = mitre?.tactics || []
  const techniques = mitre?.techniques || []

  return (
    <div className="space-y-5">
      {/* Tactics flow mapping */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Detected adversary tactics</p>
        <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-slate-950/40 border border-slate-850">
          {tactics.length > 0 ? (
            tactics.map((tactic, idx) => (
              <React.Fragment key={tactic}>
                <span className="rounded-lg border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-orange-400 shadow-inner">
                  {tactic}
                </span>
                {idx < tactics.length - 1 && (
                  <span className="text-slate-750 font-bold text-xs">➔</span>
                )}
              </React.Fragment>
            ))
          ) : (
            <span className="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              No Tactics Categorized
            </span>
          )}
        </div>
      </div>

      {/* Techniques cards */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">Mapped techniques</p>
        {techniques.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {techniques.map((tech) => (
              <a
                key={tech.id}
                href={`https://attack.mitre.org/techniques/${tech.id.split('.')[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-800 bg-[#111827]/10 p-3.5 hover:border-soc-primary/30 hover:bg-slate-900/20 transition duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[9px] font-bold text-soc-primary bg-soc-primary/10 border border-soc-primary/20 px-1.5 py-0.5 rounded">
                      {tech.id}
                    </span>
                    <ExternalLink className="h-3 w-3 text-slate-600 group-hover:text-soc-primary transition-colors duration-200" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-slate-100 transition-colors">{tech.name}</h4>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic pl-1">No mapped MITRE techniques detected.</p>
        )}
      </div>
    </div>
  )
}

// 6. Chronological Adversary Timeline Component
function TimelineSection({ timeline = [], summary }) {
  const parseTimelineEvent = (eventStr) => {
    const parts = eventStr.split(" - ")
    if (parts.length >= 2) {
      const timestamp = parts[0].trim()
      const description = parts.slice(1).join(" - ").trim()
      return { timestamp, description }
    }
    return { timestamp: "", description: eventStr }
  }

  const getTimelineIcon = (description) => {
    const text = description.toLowerCase()
    if (text.includes("login") || text.includes("logon") || text.includes("credential") || text.includes("password")) {
      return Key
    }
    if (text.includes("ssh") || text.includes("terminal") || text.includes("command")) {
      return Terminal
    }
    if (text.includes("powershell") || text.includes("script") || text.includes("process") || text.includes("execution")) {
      return Cpu
    }
    if (text.includes("ip") || text.includes("country") || text.includes("vpn") || text.includes("geographic")) {
      return Globe
    }
    if (text.includes("malware") || text.includes("mimikatz") || text.includes("blocked") || text.includes("hash")) {
      return ShieldAlert
    }
    if (text.includes("network") || text.includes("firewall") || text.includes("traffic") || text.includes("port")) {
      return Network
    }
    return ShieldCheck
  }

  return (
    <div className="space-y-5">
      {summary && (
        <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/20 text-xs leading-relaxed text-slate-350 font-medium">
          {summary}
        </div>
      )}

      {timeline.length > 0 ? (
        <div className="relative pl-8 border-l-2 border-slate-800 space-y-4">
          {timeline.map((eventStr, idx) => {
            const { timestamp, description } = parseTimelineEvent(eventStr)
            const EventIcon = getTimelineIcon(description)
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="relative group"
              >
                {/* Timeline node icon */}
                <div className="absolute -left-[49px] top-0.5 h-8 w-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-soc-primary shadow-inner group-hover:border-soc-primary/50 group-hover:text-cyan-300 transition-all duration-200 z-10">
                  {/* Pulse effect on first item (most recent) */}
                  {idx === 0 && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-soc-primary/20 animate-ping opacity-75" />
                  )}
                  <EventIcon className="h-4 w-4" />
                </div>

                <div className="space-y-1 bg-slate-900/10 hover:bg-slate-900/30 py-2 px-3.5 rounded-xl border border-transparent hover:border-slate-800/80 transition duration-150">
                  {timestamp && (
                    <span className="font-mono text-[9px] font-bold text-slate-500 block uppercase tracking-wider">
                      {timestamp}
                    </span>
                  )}
                  <p className="text-xs font-semibold leading-relaxed text-slate-200 group-hover:text-slate-100 transition-colors">
                    {description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-500 italic pl-1">No timeline logs compiled for this threat.</p>
      )}
    </div>
  )
}

function IncidentDetailsPage() {
  const { incidentId } = useParams()
  const navigate = useNavigate()

  const [investigation, setInvestigation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [copied, setCopied] = useState(false)
  const [reportExpanded, setReportExpanded] = useState(false)
  const [copiedIP, setCopiedIP] = useState(false)

  useEffect(() => {
    loadInvestigation()
  }, [incidentId])

  async function loadInvestigation() {
    setLoading(true)
    setError("")

    try {
      const result = await getInvestigation(incidentId)
      setInvestigation(result)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to connect to database. Please reload."
      )
    } finally {
      setLoading(false)
    }
  }

  function downloadReport() {
    if (!investigation?.report) return

    const blob = new Blob([investigation.report], {
      type: "text/markdown",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${investigation.incident_id}_soc_report.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleCopyToClipboard() {
    if (!investigation?.report) return
    navigator.clipboard.writeText(investigation.report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyIP = (ip) => {
    navigator.clipboard.writeText(ip)
    setCopiedIP(true)
    setTimeout(() => setCopiedIP(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220]">
        <Navbar backendStatus={{ online: true }} />
        <Loader />
      </div>
    )
  }

  if (error || !investigation) {
    return (
      <div className="min-h-screen bg-[#0B1220]">
        <Navbar backendStatus={{ online: false }} />
        <ErrorCard message={error || "Incident records not found."} onRetry={loadInvestigation} />
      </div>
    )
  }

  // Map structured properties directly from the extended API database response payload
  const riskAnalysis = investigation?.risk_analysis || {}
  const pRisk = {
    score: riskAnalysis.risk_score ?? investigation?.risk_score ?? 0,
    level: riskAnalysis.risk_level ?? investigation?.risk_level ?? "Unknown",
    reasons: riskAnalysis.reasons || []
  }

  const pMitre = investigation?.mitre || { tactics: [], techniques: [] }
  const pIocs = investigation?.iocs || { ips: [], users: [], countries: [], organizations: [], domains: [], urls: [], emails: [], hashes: [] }
  const pPlan = investigation?.response_plan || { priority: "Medium", estimated_impact: "Low", containment: [], eradication: [], recovery: [], recommendations: [] }

  const alertAnalysis = investigation?.alert_analysis || {}
  const pAlert = {
    severity: alertAnalysis.severity ?? investigation?.severity ?? "N/A",
    category: alertAnalysis.category ?? "Adversary Activity",
    confidence: alertAnalysis.confidence ?? 85,
    reason: alertAnalysis.reason ?? investigation?.summary ?? "N/A"
  }

  const pThreat = investigation?.threat_intelligence || { ip: "N/A", country: "N/A", city: "N/A", isp: "N/A", organization: "N/A", timezone: "N/A" }

  const correlation = investigation?.correlation || {}
  const pCorrelation = {
    incident_type: correlation.incident_type ?? investigation?.incident_type ?? "N/A",
    severity: correlation.severity ?? investigation?.severity ?? "N/A",
    confidence: correlation.confidence ?? 85,
    summary: correlation.summary ?? investigation?.summary ?? "N/A",
    timeline: correlation.timeline || []
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 font-sans">
      <Navbar backendStatus={{ online: true }} />

      <div className="mx-auto w-full max-w-none px-6 py-6 xl:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          <Sidebar />

          <main className="space-y-8 min-w-0">
            {/* Header row control glass card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-3xl p-6 shadow-soc relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-24 h-[1px] bg-soc-primary shadow-[0_0_15px_#00E5FF]" />
              
              <button
                onClick={() => navigate("/incidents")}
                className="mb-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-soc-primary hover:text-cyan-300 transition"
              >
                <ArrowLeft size={14} />
                Back to Repository
              </button>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Security Incident Details</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                    <span className="text-xs font-mono font-bold text-soc-primary">{investigation.incident_id}</span>
                  </div>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">
                    {investigation.incident_type}
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <span className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${getSeverityBadgeStyles(investigation.severity)}`}>
                      Tier: {investigation.severity}
                    </span>
                    <span className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-bold text-slate-350">
                      Posture: {investigation.risk_level} Risk
                    </span>
                    <span className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-bold text-soc-primary">
                      Score: {investigation.risk_score}/100
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 font-mono">
                    <Calendar size={14} className="text-slate-500" />
                    {new Date(investigation.created_at).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <button
                    onClick={downloadReport}
                    className="flex items-center justify-center gap-2 rounded-xl bg-soc-primary px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition shadow-inner shrink-0"
                  >
                    <FileDown size={14} />
                    Download Brief
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Split layout: Main sections (Left) vs Posture/Evidence metrics (Right) */}
            <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
              
              {/* Left Column (Details) */}
              <div className="space-y-8 min-w-0">
                
                {/* 1. Executive Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="glass-card rounded-3xl p-6 md:p-8 border-slate-700/60 shadow-soc"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-850 pb-3">
                    <ShieldCheck className="h-4.5 w-4.5 text-soc-primary" />
                    <h3 className="text-base font-bold text-slate-100">1. Executive Summary</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-350 font-medium">
                    {investigation.summary || "No executive summary available."}
                  </p>
                </motion.div>

                {/* Adversary Correlation & Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 }}
                  className="glass-card rounded-3xl p-6 md:p-8 border-slate-700/60 shadow-soc"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-850 pb-3">
                    <Clock className="h-4.5 w-4.5 text-soc-primary" />
                    <h3 className="text-base font-bold text-slate-100">2. Attack Timeline & Correlation</h3>
                  </div>
                  <TimelineSection
                    timeline={pCorrelation.timeline}
                    summary={pCorrelation.summary !== 'N/A' && pCorrelation.summary !== investigation.summary ? pCorrelation.summary : null}
                  />
                </motion.div>

                {/* 2. MITRE ATT&CK Mapping */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="glass-card rounded-3xl p-5 border-slate-800/50 shadow-md"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-850 pb-3">
                    <Layers className="h-4.5 w-4.5 text-soc-primary" />
                    <h3 className="text-sm font-bold text-slate-200">3. MITRE ATT&CK Framework</h3>
                  </div>
                  <MitreAttackSection mitre={pMitre} />
                </motion.div>

                {/* 3. IOC Extraction */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="glass-card rounded-3xl p-5 border-slate-800/50 shadow-md"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-850 pb-3">
                    <Bookmark className="h-4.5 w-4.5 text-soc-primary" />
                    <h3 className="text-sm font-bold text-slate-200">4. Indicators of Compromise (IOC)</h3>
                  </div>
                  <IOCTabs iocs={pIocs} />
                </motion.div>

                {/* 4. Playbook Response Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="glass-card rounded-3xl p-5 border-slate-800/50 shadow-md"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-850 pb-3">
                    <Activity className="h-4.5 w-4.5 text-soc-primary" />
                    <h3 className="text-sm font-bold text-slate-200">5. Playbook Response Actions</h3>
                  </div>
                  
                  <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-800 bg-[#111827]/10 p-4">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Playbook Priority</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`h-2.5 w-2.5 rounded-full ${getSeverityDotColor(pPlan.priority)}`} />
                        <span className="text-base font-bold text-slate-200">{pPlan.priority}</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-[#111827]/10 p-4">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated Posture Impact</span>
                      <p className="text-base font-bold text-slate-200 mt-1">{pPlan.estimated_impact}</p>
                    </div>
                  </div>

                  <ResponsePlaybookCards plan={pPlan} />
                </motion.div>

                {/* 5. Telemetry Log Console */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  className="glass-card rounded-3xl p-5 border-slate-800/50 shadow-md"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-850 pb-3">
                    <Terminal className="h-4.5 w-4.5 text-soc-primary" />
                    <h3 className="text-sm font-bold text-slate-200">6. Raw Telemetry Event logs</h3>
                  </div>
                  <HackerConsoleLogs logs={investigation.logs} />
                </motion.div>
              </div>

              {/* Right Column (Metrics Dashboard) */}
              <div className="space-y-8 min-w-0">
                
                {/* A. Risk Posture Circular Gauge */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 }}
                  className="glass-card rounded-3xl p-5 border-slate-800/50 shadow-md relative"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-850 pb-3">
                    <Cpu className="h-4.5 w-4.5 text-soc-primary" />
                    <h3 className="text-sm font-bold text-slate-200">Risk Assessment</h3>
                  </div>

                  <div className="flex flex-col items-center justify-center p-3">
                    <CircularRiskGauge score={pRisk.score} level={pRisk.level} />
                  </div>

                  <div className="mt-4 border-t border-slate-850/80 pt-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Posture Threat Triggers</span>
                    {pRisk.reasons.length > 0 ? (
                      <ul className="space-y-2">
                        {pRisk.reasons.map((reason, idx) => (
                          <li key={idx} className="flex gap-2.5 text-xs text-slate-350 leading-relaxed font-medium bg-[#0B1220]/40 border border-slate-850 rounded-xl p-2.5">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-soc-danger shadow-red-glow" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500 italic text-center py-2">No specific risk triggers logged.</p>
                    )}
                  </div>
                </motion.div>

                {/* B. Alert Information & Confidence */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.12 }}
                  className="glass-card rounded-3xl p-5 border-slate-800/50 shadow-md"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-850 pb-3">
                    <AlertTriangle className="h-4.5 w-4.5 text-soc-primary" />
                    <h3 className="text-sm font-bold text-slate-200">Alert Information</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Security Category</span>
                      <p className="text-xs font-bold text-slate-200 mt-1">{pAlert.category}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Detection Confidence</span>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="h-2 w-full rounded-full bg-slate-850 overflow-hidden">
                          <div className="h-full bg-soc-primary rounded-full shadow-cyan-glow" style={{ width: `${pAlert.confidence}%` }} />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-300 shrink-0">{pAlert.confidence}%</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-850/80 pt-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Detection Reasoning</span>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-medium">
                        {pAlert.reason}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* C. Threat Intelligence Network Footprint */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.16 }}
                  className="glass-card rounded-3xl p-5 border-slate-800/50 shadow-md"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-850 pb-3">
                    <Globe className="h-4.5 w-4.5 text-soc-primary" />
                    <h3 className="text-sm font-bold text-slate-200">Threat Intelligence</h3>
                  </div>

                  <div className="space-y-4 text-xs font-medium">
                    <div className="flex items-center justify-between p-2.5 bg-[#0B1220]/40 border border-slate-850 rounded-xl relative group">
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span className="text-slate-450 text-[10px] font-bold uppercase tracking-wider shrink-0">Origin IP</span>
                      </div>
                      
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs font-bold text-soc-primary select-all truncate">
                          {pThreat.ip}
                        </span>
                        {pThreat.ip !== "N/A" && (
                          <button
                            type="button"
                            onClick={() => handleCopyIP(pThreat.ip)}
                            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-450 hover:text-soc-primary transition"
                            title="Copy IP to clipboard"
                          >
                            {copiedIP ? (
                              <Check className="h-3 w-3 text-soc-success animate-pulse" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-[#0B1220]/40 border border-slate-850 rounded-xl">
                        <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider block">Country</span>
                        <span className="text-slate-200 font-semibold block mt-1">{pThreat.country}</span>
                      </div>
                      <div className="p-2.5 bg-[#0B1220]/40 border border-slate-850 rounded-xl">
                        <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider block">ISP</span>
                        <span className="text-slate-200 font-semibold block mt-1 truncate" title={pThreat.isp}>{pThreat.isp}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-[#0B1220]/40 border border-slate-850 rounded-xl">
                        <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider block">City</span>
                        <span className="text-slate-200 font-semibold block mt-1">{pThreat.city}</span>
                      </div>
                      <div className="p-2.5 bg-[#0B1220]/40 border border-slate-850 rounded-xl">
                        <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider block">Timezone</span>
                        <span className="text-slate-200 font-semibold block mt-1 font-mono text-[10px]">{pThreat.timezone}</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#0B1220]/40 border border-slate-850 rounded-xl">
                      <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider block">ISP Organization</span>
                      <span className="text-slate-250 font-bold block mt-1 truncate" title={pThreat.organization}>{pThreat.organization}</span>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Bottom Section: Collapsible Analyst Executive Briefing */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="glass-card rounded-3xl shadow-soc overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setReportExpanded(!reportExpanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-900/10 transition border-b border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-soc-primary/10 text-soc-primary border border-soc-primary/20">
                    <Library className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Document Ledger</span>
                    <h3 className="text-lg font-bold text-slate-200 mt-0.5">Analyst Executive Briefing</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">
                    {reportExpanded ? "Collapse briefing report" : "Expand briefing report"}
                  </span>
                  <div className={`h-8 w-8 rounded-xl border border-slate-800 flex items-center justify-center text-slate-450 transform transition-transform ${reportExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {reportExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t border-slate-850 bg-slate-950/20">
                      <div className="flex justify-end gap-2.5 mb-6">
                        <button
                          onClick={handleCopyToClipboard}
                          className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#111827]/60 px-4 py-2.5 text-xs font-bold text-slate-350 hover:text-slate-200 transition"
                        >
                          {copied ? (
                            <>
                              <Check size={14} className="text-soc-success animate-pulse" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              <span>Copy Markdown</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={downloadReport}
                          className="flex items-center gap-2 rounded-xl bg-soc-primary px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition shadow-inner"
                        >
                          <FileDown size={14} />
                          <span>Download Report</span>
                        </button>
                      </div>

                      {/* Render markdown using customized elements matching design system */}
                      <div className="prose prose-invert max-w-none text-slate-300">
                        <ReactMarkdown
                          components={{
                            h1: ({ node, ...props }) => <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-2 mt-6 mb-3.5 first:mt-0 uppercase tracking-wider" {...props} />,
                            h2: ({ node, ...props }) => <h3 className="text-sm font-bold text-slate-200 mt-5 mb-2.5 uppercase tracking-wide" {...props} />,
                            h3: ({ node, ...props }) => <h4 className="text-xs font-bold text-slate-250 mt-4 mb-2 uppercase" {...props} />,
                            p: ({ node, ...props }) => <p className="text-xs leading-relaxed mt-2 mb-3.5 text-slate-350" {...props} />,
                            ul: ({ node, ...props }) => <ul className="ml-5 list-disc space-y-2 text-xs text-slate-350 mt-2 mb-3.5" {...props} />,
                            ol: ({ node, ...props }) => <ol className="ml-5 list-decimal space-y-2 text-xs text-slate-350 mt-2 mb-3.5" {...props} />,
                            code: ({ inline, children, ...props }) => (
                              <code
                                className={inline ? 'rounded bg-slate-900 px-1 py-0.5 text-soc-primary font-mono text-[10px]' : 'block rounded-xl bg-slate-900 p-4 text-xs font-mono text-slate-300 overflow-x-auto my-3 border border-slate-850'}
                                {...props}
                              >
                                {children}
                              </code>
                            ),
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-soc-primary pl-4 italic text-slate-400 my-3 text-xs" {...props} />,
                            table: ({ node, ...props }) => (
                              <div className="overflow-x-auto my-4 border border-slate-850 rounded-2xl">
                                <table className="w-full text-xs text-left border-collapse" {...props} />
                              </div>
                            ),
                            thead: ({ node, ...props }) => <thead className="bg-[#111827]/40 border-b border-slate-850 text-slate-450 uppercase text-[9px] tracking-wider" {...props} />,
                            tr: ({ node, ...props }) => <tr className="border-b border-slate-850/40 hover:bg-slate-900/10" {...props} />,
                            th: ({ node, ...props }) => <th className="px-4 py-3 font-bold" {...props} />,
                            td: ({ node, ...props }) => <td className="px-4 py-2.5 text-slate-350" {...props} />,
                          }}
                        >
                          {investigation.report}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </main>
        </div>
      </div>
    </div>
  )
}

export default IncidentDetailsPage