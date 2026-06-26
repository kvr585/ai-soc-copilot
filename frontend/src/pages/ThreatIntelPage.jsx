import React, { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts"
import {
  ShieldAlert,
  Globe,
  Copy,
  Check,
  Search,
  FileText,
  RefreshCw,
  TrendingUp,
  MapPin,
  Database,
  Inbox,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Users,
  Mail,
  Hash,
  Link2,
  Server
} from "lucide-react"

import Navbar from "../components/Navbar.jsx"
import Sidebar from "../components/Sidebar.jsx"
import Loader from "../components/Loader.jsx"
import ErrorCard from "../components/ErrorCard.jsx"

import { getAllInvestigations } from "../services/api.js"

// Severity Styling helper
function getSeverityBadgeStyles(sev) {
  const s = String(sev).toLowerCase()
  if (s === 'critical') return 'border-red-500/20 bg-red-500/10 text-red-400'
  if (s === 'high') return 'border-orange-500/20 bg-orange-500/10 text-orange-400'
  if (s === 'medium') return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'
  return 'border-green-500/20 bg-green-500/10 text-green-400'
}

// Custom Glassmorphic Tooltip for Recharts
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-[#0B1220]/95 p-3 shadow-xl backdrop-blur-md font-sans">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <div className="mt-2 space-y-1.5">
          {payload.map((pld, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: pld.color || pld.fill || '#00E5FF' }} />
              <span className="text-slate-400 font-medium">{pld.name || 'Count'}:</span>
              <span className="text-slate-100 font-bold">{pld.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

// Threat Map SVG Component
function ThreatMap({ countriesMap }) {
  const countryPositions = {
    "United States": { x: 90, y: 70, label: "US" },
    "Canada": { x: 90, y: 50, label: "CA" },
    "Germany": { x: 200, y: 55, label: "DE" },
    "Russia": { x: 250, y: 45, label: "RU" },
    "China": { x: 290, y: 80, label: "CN" },
    "India": { x: 260, y: 95, label: "IN" },
    "United Kingdom": { x: 185, y: 50, label: "UK" },
    "Netherlands": { x: 195, y: 48, label: "NL" },
    "Brazil": { x: 140, y: 135, label: "BR" },
    "Australia": { x: 335, y: 145, label: "AU" },
    "Japan": { x: 320, y: 72, label: "JP" },
    "France": { x: 190, y: 60, label: "FR" },
    "Singapore": { x: 295, y: 110, label: "SG" }
  }

  const activeCountries = useMemo(() => {
    return Object.entries(countriesMap).map(([name, count]) => {
      const pos = countryPositions[name] || countryPositions[name.split(',')[0]]
      if (pos) {
        return { name, count, ...pos }
      }
      return null
    }).filter(Boolean)
  }, [countriesMap])

  if (activeCountries.length === 0) {
    return (
      <div className="flex items-center justify-center gap-4 h-28 border border-dashed border-slate-800/60 rounded-2xl bg-slate-950/20 p-4 text-left">
        <Globe className="h-8 w-8 text-slate-600/80 animate-pulse shrink-0" />
        <div>
          <p className="text-xs text-slate-400 font-bold">No geographic intelligence available.</p>
          <p className="text-[10px] text-slate-550 mt-0.5 leading-snug font-medium">Geographical mapping requires telemetry incidents created with active external IP addresses.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative border border-slate-850 rounded-2xl bg-slate-950/40 p-4 overflow-hidden h-72">
      <svg className="w-full h-full text-slate-900" viewBox="0 0 400 200" fill="none">
        <defs>
          <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        
        {/* Simple dots representing landmasses */}
        <circle cx="70" cy="50" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="85" cy="55" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="100" cy="65" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="95" cy="75" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="75" cy="60" r="1.5" fill="#334155" opacity="0.4" />
        
        <circle cx="130" cy="115" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="140" cy="130" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="145" cy="145" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="150" cy="160" r="1.5" fill="#334155" opacity="0.4" />
        
        <circle cx="190" cy="50" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="205" cy="55" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="225" cy="52" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="250" cy="58" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="270" cy="65" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="290" cy="75" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="280" cy="85" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="265" cy="95" r="1.5" fill="#334155" opacity="0.4" />
        
        <circle cx="195" cy="100" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="205" cy="115" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="215" cy="130" r="1.5" fill="#334155" opacity="0.4" />
        
        <circle cx="330" cy="135" r="1.5" fill="#334155" opacity="0.4" />
        <circle cx="340" cy="145" r="1.5" fill="#334155" opacity="0.4" />

        {activeCountries.map((c, idx) => (
          <g key={`threat-link-${idx}`}>
            <path
              d={`M 200,55 Q ${200 + (c.x - 200)/2},${55 + (c.y - 55)/2 - 30} ${c.x},${c.y}`}
              stroke="#00E5FF"
              strokeWidth="0.8"
              strokeDasharray="4,4"
              opacity="0.25"
            />
          </g>
        ))}

        {activeCountries.map((c, idx) => (
          <g key={`threat-node-${idx}`} className="cursor-pointer group">
            <circle cx={c.x} cy={c.y} r="8" fill="transparent" stroke="#00E5FF" strokeWidth="1" opacity="0.6">
              <animate attributeName="r" values="3;12;3" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx={c.x} cy={c.y} r="3.5" fill="#00E5FF" className="drop-shadow-[0_0_4px_#00E5FF]" />
            <title>{`${c.name}: ${c.count} threats mapped`}</title>
          </g>
        ))}
      </svg>
      
      <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5 max-w-full z-10">
        {activeCountries.slice(0, 4).map((c, idx) => (
          <span key={idx} className="bg-[#0B1220]/80 border border-slate-800 rounded px-1.5 py-0.5 text-[8.5px] font-mono text-slate-350 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-soc-primary animate-pulse" />
            <span>{c.label} ({c.count})</span>
          </span>
        ))}
        {activeCountries.length > 4 && (
          <span className="bg-[#0B1220]/80 border border-slate-800 rounded px-1.5 py-0.5 text-[8.5px] font-mono text-slate-500">
            +{activeCountries.length - 4} more
          </span>
        )}
      </div>
    </div>
  )
}

function ThreatIntelPage() {
  const [investigations, setInvestigations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("ips")
  const [copiedIndicator, setCopiedIndicator] = useState(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadInvestigations()
  }, [])

  async function loadInvestigations() {
    setLoading(true)
    setError("")
    try {
      const data = await getAllInvestigations()
      setInvestigations(data || [])
    } catch (err) {
      setError(err.message || "Failed to fetch threat intelligence data.")
    } finally {
      setLoading(false)
    }
  }

  // Aggregate stats across investigations
  const stats = useMemo(() => {
    const defaultStats = {
      totalIOCs: 0,
      uniqueIPs: 0,
      countriesCount: 0,
      organizationsCount: 0,
      highRiskCount: 0,
      
      ips: [],
      domains: [],
      urls: [],
      hashes: [],
      users: [],
      emails: [],
      
      countries: {},
      organizations: {},
      isps: {},
      
      topCountry: "N/A",
      topISP: "N/A",
      topOrg: "N/A",
      mostCommonType: "N/A",
      avgRiskScore: 0,
      
      threatFeed: [],
      recentActivity: [],
      
      mitreFrequencies: [],
      categoryFrequencies: [],
      iocCategoryCounts: []
    }

    if (!investigations || investigations.length === 0) return defaultStats

    const ipsSet = new Set()
    const domainsSet = new Set()
    const urlsSet = new Set()
    const hashesSet = new Set()
    const usersSet = new Set()
    const emailsSet = new Set()
    
    const countriesMap = {}
    const organizationsMap = {}
    const ispsMap = {}
    const typesMap = {}
    const mitreMap = {}
    
    let totalRisk = 0
    let highRiskCount = 0
    
    const tempThreatFeed = []
    const tempRecentActivity = []

    investigations.forEach((inv) => {
      const risk = inv.risk_score ?? 0
      totalRisk += risk
      if (risk >= 70) highRiskCount++

      const type = inv.incident_type || "Unknown Threat"
      typesMap[type] = (typesMap[type] || 0) + 1

      const threatInfo = inv.threat_intelligence || {}
      const ip = threatInfo.ip || ""
      if (ip && ip !== "N/A") ipsSet.add(ip)
      
      const country = threatInfo.country || ""
      if (country && country !== "N/A") {
        countriesMap[country] = (countriesMap[country] || 0) + 1
      }
      
      const isp = threatInfo.isp || ""
      if (isp && isp !== "N/A") {
        ispsMap[isp] = (ispsMap[isp] || 0) + 1
      }
      
      const org = threatInfo.organization || ""
      if (org && org !== "N/A") {
        organizationsMap[org] = (organizationsMap[org] || 0) + 1
      }

      const iocs = inv.iocs || {}
      if (iocs.ips) iocs.ips.forEach(val => { if (val) ipsSet.add(val) })
      if (iocs.domains) iocs.domains.forEach(val => { if (val) domainsSet.add(val) })
      if (iocs.urls) iocs.urls.forEach(val => { if (val) urlsSet.add(val) })
      if (iocs.hashes) iocs.hashes.forEach(val => { if (val) hashesSet.add(val) })
      if (iocs.users) iocs.users.forEach(val => { if (val) usersSet.add(val) })
      if (iocs.emails) iocs.emails.forEach(val => { if (val) emailsSet.add(val) })
      if (iocs.countries) iocs.countries.forEach(val => { if (val && val !== "N/A") countriesMap[val] = (countriesMap[val] || 0) + 1 })
      if (iocs.organizations) iocs.organizations.forEach(val => { if (val && val !== "N/A") organizationsMap[val] = (organizationsMap[val] || 0) + 1 })

      const mitre = inv.mitre || {}
      if (mitre.techniques) {
        mitre.techniques.forEach((tech) => {
          const key = `${tech.id} - ${tech.name}`
          mitreMap[key] = (mitreMap[key] || 0) + 1
        })
      }

      tempRecentActivity.push({
        id: inv.id,
        incident_id: inv.incident_id,
        incident_type: type,
        severity: inv.severity || "Low",
        country: country || "Unknown",
        created_at: inv.created_at
      })

      const severity = inv.severity || "Low"
      const addFeed = (val, cat) => {
        if (val && !tempThreatFeed.some(f => f.value === val)) {
          tempThreatFeed.push({ value: val, category: cat, severity, incident_id: inv.incident_id, id: inv.id })
        }
      }
      if (iocs.ips) iocs.ips.forEach(val => addFeed(val, "IP Address"))
      if (iocs.domains) iocs.domains.forEach(val => addFeed(val, "Domain"))
      if (iocs.hashes) iocs.hashes.forEach(val => addFeed(val, "Hash"))
    })

    const ips = Array.from(ipsSet)
    const domains = Array.from(domainsSet)
    const urls = Array.from(urlsSet)
    const hashes = Array.from(hashesSet)
    const users = Array.from(usersSet)
    const emails = Array.from(emailsSet)

    const totalIOCs = ips.length + domains.length + urls.length + hashes.length + users.length + emails.length

    const getTopKey = (map) => {
      let topKey = "N/A"
      let maxVal = -1
      Object.entries(map).forEach(([k, v]) => {
        if (v > maxVal) {
          maxVal = v
          topKey = k
        }
      })
      return topKey
    }

    const mitreFrequencies = Object.entries(mitreMap)
      .map(([tech, count]) => ({ tech: tech.length > 25 ? `${tech.substring(0, 23)}...` : tech, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const categoryFrequencies = Object.entries(typesMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const iocCategoryCounts = [
      { name: "IPs", value: ips.length, fill: "#00E5FF" },
      { name: "Domains", value: domains.length, fill: "#FACC15" },
      { name: "URLs", value: urls.length, fill: "#8B5CF6" },
      { name: "Hashes", value: hashes.length, fill: "#EF4444" },
      { name: "Users", value: users.length, fill: "#3B82F6" },
      { name: "Emails", value: emails.length, fill: "#10B981" }
    ].filter(c => c.value > 0)

    return {
      totalIOCs,
      uniqueIPs: ips.length,
      countriesCount: Object.keys(countriesMap).length,
      organizationsCount: Object.keys(organizationsMap).length,
      highRiskCount,
      
      ips,
      domains,
      urls,
      hashes,
      users,
      emails,
      
      countries: countriesMap,
      organizations: organizationsMap,
      isps: ispsMap,
      
      topCountry: getTopKey(countriesMap),
      topISP: getTopKey(ispsMap),
      topOrg: getTopKey(organizationsMap),
      mostCommonType: getTopKey(typesMap),
      avgRiskScore: investigations.length > 0 ? Math.round(totalRisk / investigations.length) : 0,
      
      threatFeed: tempThreatFeed.slice(0, 8),
      recentActivity: tempRecentActivity.slice(0, 6),
      
      mitreFrequencies,
      categoryFrequencies,
      iocCategoryCounts
    }
  }, [investigations])

  // Get active tab list based on search
  const currentIOCList = useMemo(() => {
    const list = stats[activeTab] || []
    if (!searchQuery) return list
    return list.filter(item => 
      String(item).toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [stats, activeTab, searchQuery])

  // Copy individual indicator
  const handleCopyItem = (item, idx) => {
    navigator.clipboard.writeText(item)
    setCopiedIndicator(idx)
    setTimeout(() => setCopiedIndicator(null), 2000)
  }

  // Copy entire IOC list
  const handleCopyAllIOCs = () => {
    const allItems = [
      ...stats.ips.map(i => `${i} (IP)`),
      ...stats.domains.map(d => `${d} (Domain)`),
      ...stats.urls.map(u => `${u} (URL)`),
      ...stats.hashes.map(h => `${h} (Hash)`),
      ...stats.users.map(u => `${u} (User)`),
      ...stats.emails.map(e => `${e} (Email)`)
    ]
    if (allItems.length === 0) return
    navigator.clipboard.writeText(allItems.join("\n"))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  // Export report download trigger
  const handleExportReport = () => {
    setExporting(true)
    setTimeout(() => {
      const reportMarkdown = `# AI SOC Threat Intelligence Report
Generated: ${new Date().toLocaleString()}

## Executive Threat posture
- **Total Mapped Incidents**: ${investigations.length}
- **Average Risk Score**: ${stats.avgRiskScore}/100
- **High Risk Incidents**: ${stats.highRiskCount}
- **Top Origin Country**: ${stats.topCountry}
- **Top Attack Infrastructure ISP**: ${stats.topISP}

## Indicator of Compromise ledger
### IP Addresses (${stats.ips.length})
${stats.ips.map(ip => `- ${ip}`).join("\n") || "No IP addresses collected."}

### Domains (${stats.domains.length})
${stats.domains.map(d => `- ${d}`).join("\n") || "No domains collected."}

### URLs (${stats.urls.length})
${stats.urls.map(u => `- ${u}`).join("\n") || "No URLs collected."}

### File Hashes (${stats.hashes.length})
${stats.hashes.map(h => `- ${h}`).join("\n") || "No file hashes collected."}

### Usernames (${stats.users.length})
${stats.users.map(u => `- ${u}`).join("\n") || "No usernames collected."}

### Email Addresses (${stats.emails.length})
${stats.emails.map(e => `- ${e}`).join("\n") || "No email addresses collected."}

## MITRE Techniques Categorized
${stats.mitreFrequencies.map(f => `- ${f.tech}: ${f.count} incidents`).join("\n") || "No MITRE techniques mapped."}
`
      const blob = new Blob([reportMarkdown], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `soc_threat_intel_report_${new Date().toISOString().split('T')[0]}.md`
      link.click()
      URL.revokeObjectURL(url)
      setExporting(false)
    }, 800)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220]">
        <Navbar backendStatus={{ online: true }} />
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1220]">
        <Navbar backendStatus={{ online: false }} />
        <ErrorCard message={error} onRetry={loadInvestigations} />
      </div>
    )
  }

  const iocCategories = [
    { key: "ips", label: "IP Addresses", icon: Globe, emptyText: "No IP addresses have been collected yet." },
    { key: "domains", label: "Domains", icon: Server, emptyText: "No domains have been collected yet." },
    { key: "urls", label: "URLs", icon: Link2, emptyText: "No URLs have been collected yet." },
    { key: "hashes", label: "Hashes", icon: Hash, emptyText: "No file hashes have been collected yet." },
    { key: "users", label: "Users", icon: Users, emptyText: "No usernames have been collected yet." },
    { key: "emails", label: "Emails", icon: Mail, emptyText: "No email addresses have been collected yet." }
  ]

  const activeTabConfig = iocCategories.find(c => c.key === activeTab) || iocCategories[0]

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 font-sans">
      <Navbar backendStatus={{ online: true }} />

      <div className="mx-auto w-full max-w-none px-6 py-6 xl:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          <Sidebar />

          <main className="space-y-8 min-w-0">
            {/* Header Title Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-3xl p-6 shadow-soc relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-24 h-[1px] bg-soc-primary shadow-[0_0_15px_#00E5FF]" />
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-soc-primary animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Security Telemetry Hub</span>
                  </div>
                  <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">
                    Threat Intelligence
                  </h1>
                  <p className="text-slate-400 text-xs mt-1 max-w-2xl leading-relaxed">
                    Analyze attacker infrastructure, indicators of compromise, and global threat activity compiled from active agent security investigations.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
                  <button
                    onClick={loadInvestigations}
                    className="flex items-center justify-center gap-2 border border-slate-800 bg-[#111827]/40 hover:bg-[#111827]/85 hover:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-350 transition shrink-0"
                    title="Refresh all threat intelligence telemetry"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={handleCopyAllIOCs}
                    disabled={stats.totalIOCs === 0}
                    className="flex items-center justify-center gap-2 border border-slate-800 bg-[#111827]/40 hover:bg-[#111827]/85 hover:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-350 transition shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Copy all unique indicators to clipboard"
                  >
                    {copiedAll ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-soc-success animate-pulse" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy IOCs</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleExportReport}
                    disabled={exporting || stats.totalIOCs === 0}
                    className="flex items-center justify-center gap-2 bg-soc-primary text-slate-950 hover:bg-cyan-300 transition px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-cyan-glow shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Download summary threat intelligence report"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>{exporting ? "Exporting..." : "Export Report"}</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Quick Metrics Summary Cards Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { label: "Total IOCs", value: stats.totalIOCs, desc: "Indicators collected", icon: Database, color: "text-soc-primary" },
                { label: "Unique IPs", value: stats.uniqueIPs, desc: "Origin IP addresses", icon: Globe, color: "text-blue-400" },
                { label: "Countries", value: stats.countriesCount, desc: "Geographic hotspots", icon: MapPin, color: "text-emerald-400" },
                { label: "Organizations", value: stats.organizationsCount, desc: "ISP ASN networks", icon: Server, color: "text-amber-400" },
                { label: "High Risk Incidents", value: stats.highRiskCount, desc: "Risk score >= 70", icon: ShieldAlert, color: "text-red-400" }
              ].map((m, idx) => {
                const CardIcon = m.icon
                return (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="glass-card rounded-2xl p-4 shadow-sm relative group overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{m.label}</span>
                      <CardIcon className={`h-4 w-4 ${m.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-slate-100 font-mono tracking-tight">{m.value}</p>
                    <span className="text-[9.5px] text-slate-500 mt-1 block leading-none">{m.desc}</span>
                  </motion.div>
                )
              })}
            </div>

            {/* Main Content: Left (70%) & Right (30%) Split */}
            <div className="grid gap-8 xl:grid-cols-[2.3fr_1fr]">
              
              {/* LEFT COLUMN */}
              <div className="space-y-8 min-w-0">
                
                {/* 1. IOC Repository Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="glass-card rounded-3xl p-6 md:p-8 border-slate-700/60 shadow-soc"
                >
                  <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-850 pb-3.5">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-soc-primary" />
                      <h2 className="text-lg font-extrabold text-slate-100">Indicator of Compromise Repository</h2>
                    </div>

                    {/* Search Field */}
                    <div className="relative flex items-center w-full md:w-64">
                      <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search indicators..."
                        className="bg-slate-950/70 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-350 focus:outline-none focus:border-soc-primary/50 w-full font-mono"
                      />
                    </div>
                  </div>

                  {/* IOC Category Tabs Header */}
                  <div className="flex flex-wrap gap-1 border-b border-slate-850 pb-2 mb-4">
                    {iocCategories.map((cat) => {
                      const TabIcon = cat.icon
                      const rawCount = stats[cat.key]?.length || 0
                      const matchCount = searchQuery 
                        ? stats[cat.key]?.filter(item => String(item).toLowerCase().includes(searchQuery.toLowerCase())).length || 0
                        : rawCount

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
                          <span>{cat.label}</span>
                          <span className="rounded bg-slate-900 border border-slate-800 px-1 font-mono text-[9px]">
                            {matchCount}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* IOC List Panel */}
                  <div className="min-h-[120px] flex flex-col justify-center">
                    {currentIOCList.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                        {currentIOCList.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-850 bg-slate-950/40 hover:border-soc-primary/40 hover:bg-slate-900/10 transition duration-150 group"
                          >
                            <span className="font-mono text-xs text-slate-200 select-all truncate pr-2 font-bold tracking-tight">
                              {item}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyItem(item, idx)}
                              className="p-1 rounded bg-[#111827] border border-slate-800 text-slate-450 hover:text-soc-primary hover:border-slate-700 transition shrink-0"
                              title="Copy item to clipboard"
                            >
                              {copiedIndicator === idx ? (
                                <Check className="h-3 w-3 text-soc-success animate-pulse" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3 py-3 text-left">
                        <Inbox className="h-7 w-7 text-slate-600 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-400 font-bold">No Indicators Found</p>
                          <p className="text-[10px] text-slate-550 mt-0.5 leading-snug">{searchQuery ? "No matching indicators found." : activeTabConfig.emptyText}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* 2. Threat Map (UI) */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="glass-card rounded-3xl p-6 md:p-8 border-slate-700/60 shadow-soc"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-850 pb-3">
                    <Globe className="h-5 w-5 text-soc-primary" />
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-100">Global Threat Activity Matrix</h2>
                      <span className="text-[9.5px] text-slate-500 uppercase tracking-wider block font-semibold mt-0.5">Origin Location mapping of attack nodes</span>
                    </div>
                  </div>
                  <ThreatMap countriesMap={stats.countries} />
                </motion.div>

                {/* 3. Recent Threat Activity Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="glass-card rounded-3xl p-6 md:p-8 border-slate-700/60 shadow-soc"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-850 pb-3">
                    <TrendingUp className="h-5 w-5 text-soc-primary" />
                    <h2 className="text-lg font-extrabold text-slate-100">Recent Threat Activity Timeline</h2>
                  </div>

                  {stats.recentActivity.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-850 bg-slate-950/20">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-[#111827]/40 border-b border-slate-800 text-slate-400 uppercase text-[9px] tracking-wider font-bold">
                            <th className="px-4 py-3">Incident ID</th>
                            <th className="px-4 py-3">Threat Type</th>
                            <th className="px-4 py-3">Severity</th>
                            <th className="px-4 py-3 text-center">Origin</th>
                            <th className="px-4 py-3 text-right">Time Logged</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentActivity.map((act) => (
                            <tr key={act.id} className="border-b border-slate-850/40 hover:bg-slate-900/10">
                              <td className="px-4 py-3 font-mono font-bold text-soc-primary">
                                <Link to={`/incidents/${act.id}`} className="hover:underline flex items-center gap-1">
                                  {act.incident_id}
                                  <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                                </Link>
                              </td>
                              <td className="px-4 py-3 text-slate-200 font-semibold">{act.incident_type}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getSeverityBadgeStyles(act.severity)}`}>
                                  {act.severity}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center text-slate-350 font-medium">
                                <div className="flex items-center justify-center gap-1">
                                  <MapPin className="h-3 w-3 text-slate-500" />
                                  <span>{act.country}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-slate-500">
                                {new Date(act.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Inbox className="h-8 w-8 text-slate-750 mb-2" />
                      <p className="text-xs text-slate-500 italic">No threat activity timeline recorded.</p>
                    </div>
                  )}
                </motion.div>

              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-8 min-w-0">
                
                {/* B. Threat Intelligence Panel */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.12 }}
                  className="glass-card rounded-3xl p-5 shadow-soc space-y-6"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-850 pb-3">
                    <AlertCircle className="h-4.5 w-4.5 text-soc-primary" />
                    <h2 className="text-sm font-bold text-slate-200">Threat Intelligence Panel</h2>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Top Origin Country</span>
                        <p className="text-slate-200 font-bold mt-1 text-xs flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-500" />
                          {stats.topCountry}
                        </p>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Top Attack ISP</span>
                        <p className="text-slate-200 font-bold mt-1 text-xs truncate" title={stats.topISP}>
                          <Server className="h-3.5 w-3.5 text-slate-500 inline mr-1.5" />
                          {stats.topISP}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Top ISP Organization</span>
                        <p className="text-slate-200 font-bold mt-1 text-xs truncate" title={stats.topOrg}>
                          {stats.topOrg}
                        </p>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Common Attack Vector</span>
                        <p className="text-slate-200 font-bold mt-1 text-xs">{stats.mostCommonType}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-850/80 pt-3">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Average Threat Posture Score</span>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="h-2 w-full rounded-full bg-slate-850 overflow-hidden">
                          <div className="h-full bg-soc-primary rounded-full shadow-cyan-glow" style={{ width: `${stats.avgRiskScore}%` }} />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-300 shrink-0">{stats.avgRiskScore}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* C. Threat Feed list */}
                  <div className="border-t border-slate-850 pt-4 space-y-3">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Live Threat Indicators Feed</span>

                    {stats.threatFeed.length > 0 ? (
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
                        {stats.threatFeed.map((feed, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl border border-slate-850 bg-[#0B1220]/45 group hover:border-slate-800 transition"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-mono text-xs font-bold text-slate-200 select-all block truncate leading-tight">
                                {feed.value}
                              </span>
                              <span className="text-[9px] text-slate-500 uppercase tracking-wider block mt-0.5">
                                {feed.category}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider ${getSeverityBadgeStyles(feed.severity)}`}>
                                {feed.severity}
                              </span>
                              <Link
                                to={`/incidents/${feed.id}`}
                                className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-450 hover:text-soc-primary transition"
                                title="Inspect associated incident details"
                              >
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic text-center py-2">No threat indicators logged yet.</p>
                    )}
                  </div>
                </motion.div>

                {/* D. IOC Statistics charts */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.18 }}
                  className="glass-card rounded-3xl p-5 border-slate-800/50 shadow-md"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-slate-850 pb-3">
                    <TrendingUp className="h-4.5 w-4.5 text-soc-primary" />
                    <h2 className="text-sm font-bold text-slate-200">Indicator Distributions</h2>
                  </div>

                  <div className="space-y-6">
                    {/* 1. Category Chart */}
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Indicator Distribution</span>
                      {stats.iocCategoryCounts.length > 0 ? (
                        <div className="h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.iocCategoryCounts} margin={{ left: -25, top: 10, right: 10 }}>
                              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" opacity={0.2} vertical={false} />
                              <XAxis dataKey="name" stroke="#64748b" tickLine={false} style={{ fontSize: '9px', fontFamily: 'Plus Jakarta Sans' }} />
                              <YAxis stroke="#64748b" tickLine={false} style={{ fontSize: '9px', fontFamily: 'Plus Jakarta Sans' }} />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="value" name="Count" fill="#00E5FF" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic text-center py-2">No category data compiled.</p>
                      )}
                    </div>

                    {/* 2. MITRE Chart */}
                    <div className="border-t border-slate-850/80 pt-4">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Top Mapped MITRE Techniques</span>
                      {stats.mitreFrequencies.length > 0 ? (
                        <div className="h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={stats.mitreFrequencies} margin={{ left: -10, top: 10, right: 10 }}>
                              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                              <XAxis type="number" stroke="#64748b" tickLine={false} style={{ fontSize: '9px', fontFamily: 'Plus Jakarta Sans' }} />
                              <YAxis
                                type="category"
                                dataKey="tech"
                                stroke="#64748b"
                                tickLine={false}
                                width={85}
                                style={{ fontSize: '9px', fontWeight: 600, fontFamily: 'Plus Jakarta Sans' }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="count" name="Frequency" fill="#FACC15" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic text-center py-2">No MITRE techniques mapped.</p>
                      )}
                    </div>
                  </div>
                </motion.div>

              </div>

            </div>

          </main>
        </div>
      </div>
    </div>
  )
}

export default ThreatIntelPage
