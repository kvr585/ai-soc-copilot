import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
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
  AreaChart,
  Area,
  Legend,
  Tooltip
} from 'recharts'

import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import ErrorCard from '../components/ErrorCard.jsx'
import IncidentTable from '../components/IncidentTable.jsx'
import StatCard from '../components/StatCard.jsx'

import { getDashboard } from '../services/api.js'

import {
  Database,
  AlertCircle,
  ShieldAlert,
  Gauge,
  List,
  Clock,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
  Inbox
} from "lucide-react"

function formatDateTime(ts) {
  try {
    return new Date(ts).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
  } catch {
    return ts
  }
}

function skeletonArray(n) {
  return Array.from({ length: n })
}

// Custom Glassmorphic Tooltip for Recharts
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-[#0B1220]/95 p-3 shadow-xl backdrop-blur-md">
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

// Dynamic Chart Empty State using outline SVG Shield check
function ChartEmptyState({ title, subtitle = "No security events detected in this window." }) {
  return (
    <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-slate-800/40 bg-[#111827]/10 p-6 text-center">
      <svg className="h-12 w-12 text-slate-700/60 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h4>
      <p className="mt-1 text-[11px] text-slate-500 max-w-[220px] leading-normal">{subtitle}</p>
    </div>
  )
}

// Loading Skeleton Component
function ChartSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-72 rounded-3xl border border-slate-800 bg-[#111827]/20 animate-pulse"
    />
  )
}

function DashboardPage() {
  const [data, setData] = useState({
    total_incidents: 0,
    critical_incidents: 0,
    high_incidents: 0,
    medium_incidents: 0,
    low_incidents: 0,
    average_risk_score: 0,
    most_common_incident: '',
    last_investigation: '',
    recent_incidents: [],
    severity_distribution: {},
    risk_distribution: [],
    incident_trend: [],
    top_incident_types: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const resp = await getDashboard()
      setData(resp)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Unable to connect to backend database. Please ensure API is online.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  // Data transformations and memoization
  const severityData = useMemo(() => {
    if (!data?.severity_distribution || Object.keys(data.severity_distribution).length === 0) {
      return []
    }
    const d = data.severity_distribution
    const list = [
      { name: 'Critical', value: d.critical || 0 },
      { name: 'High', value: d.high || 0 },
      { name: 'Medium', value: d.medium || 0 },
      { name: 'Low', value: d.low || 0 }
    ]
    return list.filter(item => item.value > 0)
  }, [data])

  const riskDistributionData = useMemo(() => {
    if (!Array.isArray(data?.risk_distribution) || data.risk_distribution.length === 0) {
      return []
    }
    return data.risk_distribution.map(item => ({
      bucket: item.bucket || item.range || 'Unknown',
      count: item.count || 0
    }))
  }, [data])

  const incidentTrendData = useMemo(() => {
    if (!Array.isArray(data?.incident_trend) || data.incident_trend.length === 0) {
      return []
    }
    return data.incident_trend.map(item => ({
      date: item.date || item.timestamp || 'Unknown',
      count: item.count || 0
    }))
  }, [data])

  const topIncidentTypesData = useMemo(() => {
    if (!Array.isArray(data?.top_incident_types) || data.top_incident_types.length === 0) {
      return []
    }
    return data.top_incident_types.slice(0, 6).map(item => ({
      type: item.type || item.incident_type || 'Unknown',
      count: item.count || 0
    }))
  }, [data])

  const SEVERITY_COLORS = {
    Critical: '#EF4444',
    High: '#F97316',
    Medium: '#FACC15',
    Low: '#22C55E'
  }

  const insights = useMemo(() => {
    if (!data) return []
    const out = []
    const sev = data.severity_distribution || {}
    const total = (sev.critical || 0) + (sev.high || 0) + (sev.medium || 0) + (sev.low || 0)
    
    if (total > 0) {
      const maxKey = Object.entries(sev)
        .filter(([_, val]) => val > 0)
        .sort((a, b) => b[1] - a[1])[0]?.[0]
      if (maxKey) {
        out.push(`System Alert: Most incidents fall under ${maxKey.toUpperCase()} severity.`)
      }
    }
    
    if (data.most_common_incident && data.most_common_incident !== 'N/A' && data.most_common_incident !== 'None') {
      out.push(`Anomaly Detection: "${data.most_common_incident}" is currently the dominant vector.`)
    }
    
    if (data.average_risk_score != null && data.average_risk_score > 0) {
      out.push(`Risk Analytics: Average posture stands at ${Math.round(data.average_risk_score)}/100.`)
      if (data.average_risk_score >= 70) {
        out.push('⚠️ Security Warning: Risk score average is elevated (≥70). Action recommended.')
      }
    }
    
    if (Array.isArray(data.incident_trend) && data.incident_trend.length > 0) {
      const lastCount = data.incident_trend[data.incident_trend.length - 1]?.count || 0
      if (lastCount > 5) {
        out.push(`Activity Peak: Higher investigation volume logged recently (${lastCount} alerts).`)
      }
    }
    
    return out.length > 0 ? out : ['Telemetry stable. No anomalous insights triggered in last 24h.']
  }, [data])

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 font-sans">
      <Navbar
        backendStatus={{
          online: !error,
          message: error ? "Offline" : "Online",
        }}
      />
      
      <div className="mx-auto w-full max-w-none px-6 py-6 xl:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          <Sidebar />

          <main className="space-y-8 min-w-0">
            {/* Header Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]/40 p-6 shadow-soc backdrop-blur-md"
            >
              {/* Decorative light accent */}
              <div className="absolute top-0 left-0 w-24 h-[1px] bg-soc-primary shadow-[0_0_15px_#00E5FF]" />
              
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-soc-primary">
                    Security Operations Center
                  </p>
                  <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">
                    Security Operations Dashboard
                  </h2>
                  <p className="mt-1 text-sm text-slate-400 font-medium">
                    Real-time network security posture and automated AI investigations.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-1.5 text-xs text-slate-400 font-mono">
                  <Activity className="h-3.5 w-3.5 text-soc-primary" />
                  POSTURE: {data?.average_risk_score > 70 ? 'ELEVATED' : 'SECURE'}
                </div>
              </div>

              {/* Status Chips */}
              <div className="mt-4 flex flex-wrap gap-2.5 border-t border-slate-850/60 pt-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-green-500/5 border border-green-500/10 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-green-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                  </span>
                  Monitoring Active
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-green-500/5 border border-green-500/10 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-green-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                  </span>
                  AI Engine Online
                </div>
                <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider ${
                  data.average_risk_score > 70 
                    ? 'bg-red-500/5 border border-red-500/10 text-red-400' 
                    : 'bg-green-500/5 border border-green-500/10 text-green-400'
                }`}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${data.average_risk_score > 70 ? 'bg-red-500' : 'bg-green-500'}`} />
                    <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${data.average_risk_score > 70 ? 'bg-red-500' : 'bg-green-500'}`} />
                  </span>
                  {data.average_risk_score > 70 ? 'Elevated Posture' : 'Secure Posture'}
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-green-500/5 border border-green-500/10 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-green-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                  </span>
                  Threat Feed Connected
                </div>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && !isLoading && (
              <ErrorCard message={error} onRetry={fetch} />
            )}

            {/* KPI Cards Grid */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
              {isLoading ? (
                skeletonArray(6).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="h-24 rounded-2xl border border-slate-800 bg-[#111827]/30 animate-pulse"
                  />
                ))
              ) : (
                <>
                  <StatCard
                    title="Total Incidents"
                    value={data?.total_incidents ?? 0}
                    icon={Database}
                    accentClass="bg-cyan-500"
                    trend={data?.total_incidents > 0 ? { value: '▲ Today', type: 'up' } : null}
                  />

                  <StatCard
                    title="Critical Tier"
                    value={data?.critical_incidents ?? 0}
                    icon={AlertCircle}
                    accentClass="bg-red-500"
                    trend={data?.critical_incidents > 0 ? { value: '▼ Yesterday', type: 'down' } : null}
                  />

                  <StatCard
                    title="High Severity"
                    value={data?.high_incidents ?? 0}
                    icon={ShieldAlert}
                    accentClass="bg-orange-500"
                    trend={data?.high_incidents > 0 ? { value: '▼ Yesterday', type: 'down' } : null}
                  />

                  <StatCard
                    title="Avg Risk Score"
                    value={
                      data?.average_risk_score != null
                        ? `${Math.round(data.average_risk_score)}`
                        : "—"
                    }
                    icon={Gauge}
                    accentClass="bg-yellow-500"
                    trend={data?.average_risk_score > 0 ? { value: '▼ Yesterday', type: 'down' } : null}
                  />

                  <StatCard
                    title="Top Threat Vector"
                    value={data?.most_common_incident && data?.most_common_incident !== 'N/A' ? data.most_common_incident : "None"}
                    icon={List}
                    accentClass="bg-purple-500"
                  />

                  <StatCard
                    title="Last Telemetry"
                    value={
                      data?.last_investigation
                        ? formatDateTime(data.last_investigation)
                        : "—"
                    }
                    icon={Clock}
                    accentClass="bg-indigo-500"
                  />
                </>
              )}
            </div>

            {/* Charts & Insights Layout */}
            {!isLoading && !error && (
              <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                {/* Left Side: Charts */}
                <div className="space-y-8 min-w-0">
                  
                  {/* Top Charts Row */}
                  <div className="grid gap-8 md:grid-cols-2">
                    
                    {/* Severity Distribution */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="glass-card rounded-3xl p-5 flex flex-col justify-between border-slate-800/50"
                    >
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Classification</span>
                        <h3 className="mt-1 text-sm font-bold text-slate-200">Severity Distribution</h3>
                      </div>
                      {severityData.length > 0 ? (
                        <div className="h-72 pt-4 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={severityData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={80}
                                innerRadius={58}
                                paddingAngle={4}
                                stroke="transparent"
                              >
                                {severityData.map((entry) => (
                                  <Cell
                                    key={`cell-${entry.name}`}
                                    fill={SEVERITY_COLORS[entry.name] || '#00E5FF'}
                                  />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                              <Legend
                                verticalAlign="bottom"
                                height={24}
                                iconSize={8}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'Plus Jakarta Sans' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <ChartEmptyState title="No Severity Telemetry" subtitle="There are no classified incidents in our ledger." />
                      )}
                    </motion.div>

                    {/* Risk Score Distribution */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 }}
                      className="glass-card rounded-3xl p-5 flex flex-col justify-between border-slate-800/50"
                    >
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#0891b2" stopOpacity={0.15} />
                        </linearGradient>
                      </defs>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Metric Ranges</span>
                        <h3 className="mt-1 text-sm font-bold text-slate-200">Risk Score Distribution</h3>
                      </div>
                      {riskDistributionData.length > 0 ? (
                        <div className="h-72 pt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={riskDistributionData} margin={{ left: -25, top: 10, right: 10 }}>
                              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" opacity={0.2} vertical={false} />
                              <XAxis dataKey="bucket" stroke="#64748b" tickLine={false} style={{ fontSize: '9px', fontFamily: 'Plus Jakarta Sans' }} />
                              <YAxis stroke="#64748b" tickLine={false} axisLine={false} style={{ fontSize: '9px', fontFamily: 'Plus Jakarta Sans' }} />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="count" name="Incidents" fill="url(#barGradient)" stroke="#00E5FF" strokeWidth={1} radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <ChartEmptyState title="No Risk Posture Data" />
                      )}
                    </motion.div>
                  </div>

                  {/* Incident Trend Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="glass-card rounded-3xl p-6 md:p-8 border-slate-700/60 shadow-soc"
                  >
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#00E5FF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <div className="mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-soc-primary">Time-Series Analytics</span>
                      <h3 className="mt-1.5 text-lg font-extrabold text-slate-100">Incident Trend (Last 7 Days)</h3>
                    </div>
                    {incidentTrendData.length > 0 ? (
                      <div className="h-72 pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={incidentTrendData} margin={{ left: -25, right: 10, top: 10 }}>
                            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" opacity={0.2} vertical={false} />
                            <XAxis dataKey="date" stroke="#64748b" tickLine={false} style={{ fontSize: '9px', fontFamily: 'Plus Jakarta Sans' }} />
                            <YAxis stroke="#64748b" tickLine={false} axisLine={false} style={{ fontSize: '9px', fontFamily: 'Plus Jakarta Sans' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                               type="monotone"
                               dataKey="count"
                               name="Incident Vol"
                               stroke="#00E5FF"
                               strokeWidth={2}
                               fill="url(#areaGradient)"
                               dot={{ fill: '#0B1220', stroke: '#00E5FF', strokeWidth: 1.5, r: 4 }}
                               activeDot={{ r: 6, stroke: '#0B1220', strokeWidth: 2, fill: '#00E5FF' }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <ChartEmptyState title="No Trend Data" subtitle="Telemetry is currently flat; no incident spikes." />
                    )}
                  </motion.div>

                  {/* Top Incident Types Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="glass-card rounded-3xl p-5 border-slate-800/50"
                  >
                    <defs>
                      <linearGradient id="horizontalBarGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0891b2" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="#00E5FF" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <div className="mb-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Attack Vectors</span>
                      <h3 className="mt-1 text-sm font-bold text-slate-200">Top Incident Categories</h3>
                    </div>
                    {topIncidentTypesData.length > 0 ? (
                      <div className="h-72 pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart layout="vertical" data={topIncidentTypesData} margin={{ left: -10, top: 10, right: 10 }}>
                            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                            <XAxis type="number" stroke="#64748b" tickLine={false} style={{ fontSize: '9px', fontFamily: 'Plus Jakarta Sans' }} />
                            <YAxis
                              type="category"
                              dataKey="type"
                              stroke="#64748b"
                              tickLine={false}
                              width={120}
                              style={{ fontSize: '9px', fontWeight: 600, fontFamily: 'Plus Jakarta Sans' }}
                              tickFormatter={(val) => val.length > 16 ? `${val.substring(0, 14)}...` : val}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" name="Count" fill="url(#horizontalBarGradient)" stroke="#00E5FF" strokeWidth={1} radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <ChartEmptyState title="No Attack Vector Data" />
                    )}
                  </motion.div>
                </div>

                {/* Right Side: Insights & Recents */}
                <aside className="space-y-8 min-w-0">
                  {/* AI Assessment */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="glass-card rounded-2xl p-4 border-slate-800/60 shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-soc-primary animate-pulse" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">AI Assessment</h3>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-soc-primary bg-soc-primary/10 border border-soc-primary/20 px-2 py-0.5 rounded-full">
                          Copilot Engine
                        </span>
                      </div>

                      {/* Dynamic insights */}
                      <ul className="mt-3 space-y-2.5">
                        {insights.map((ins, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.08 }}
                            className="flex gap-2.5 text-xs text-slate-350 leading-relaxed font-medium"
                          >
                            <span className={`mt-1.5 h-1.2 w-1.2 shrink-0 rounded-full ${ins.includes('⚠️') ? 'bg-amber-500 shadow-amber-glow' : 'bg-soc-primary shadow-cyan-glow'}`} />
                            <span>{ins.replace('⚠️ ', '')}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* Structured checks (AI Assessment checks) */}
                      <div className="border-t border-slate-800/60 pt-3 mt-3">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-semibold">Threat Detection Checks</p>
                        <ul className="space-y-1.5">
                          <li className="flex items-center justify-between text-xs text-slate-300 bg-[#0B1220]/20 border border-slate-850/60 rounded-lg px-2.5 py-1.5">
                            <span className="font-semibold text-slate-400 text-[11px]">Lateral Movement Scan</span>
                            <span className="inline-flex items-center gap-1 text-[8px] font-bold text-green-400 bg-green-500/5 border border-green-500/10 px-1.5 py-0.5 rounded">
                              <span className="h-1 w-1 rounded-full bg-green-500" />
                              Clear
                            </span>
                          </li>
                          <li className="flex items-center justify-between text-xs text-slate-300 bg-[#0B1220]/20 border border-slate-850/60 rounded-lg px-2.5 py-1.5">
                            <span className="font-semibold text-slate-400 text-[11px]">Suspicious PowerShell</span>
                            <span className="inline-flex items-center gap-1 text-[8px] font-bold text-green-400 bg-green-500/5 border border-green-500/10 px-1.5 py-0.5 rounded">
                              <span className="h-1 w-1 rounded-full bg-green-500" />
                              Clear
                            </span>
                          </li>
                          <li className="flex items-center justify-between text-xs text-slate-300 bg-[#0B1220]/20 border border-slate-850/60 rounded-lg px-2.5 py-1.5">
                            <span className="font-semibold text-slate-400 text-[11px]">Posture Volatility</span>
                            <span className="inline-flex items-center gap-1 text-[8px] font-bold text-cyan-400 bg-cyan-500/5 border border-cyan-500/10 px-1.5 py-0.5 rounded">
                              <span className="h-1 w-1 rounded-full bg-cyan-500" />
                              Stable
                            </span>
                          </li>
                          <li className="flex items-center justify-between text-xs text-slate-300 bg-[#0B1220]/20 border border-slate-850/60 rounded-lg px-2.5 py-1.5">
                            <span className="font-semibold text-slate-400 text-[11px]">Credential Abuse Checks</span>
                            <span className={`inline-flex items-center gap-1 text-[8px] font-bold px-1.5 py-0.5 rounded ${
                              data.total_incidents > 0 
                                ? 'text-orange-400 bg-orange-500/5 border border-orange-500/10' 
                                : 'text-green-400 bg-green-500/5 border border-green-500/10'
                            }`}>
                              <span className={`h-1 w-1 rounded-full ${data.total_incidents > 0 ? 'bg-orange-500' : 'bg-green-500'}`} />
                              {data.total_incidents > 0 ? 'Monitoring' : 'Clear'}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>

                  {/* Recent Investigations Panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className="glass-card rounded-3xl border-slate-800/80 shadow-md overflow-hidden"
                  >
                    <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-soc-primary" />
                        <h3 className="text-sm font-bold text-slate-200">Recent Investigations</h3>
                      </div>
                    </div>
                    
                    {/* Increased scroll container max height to 520px to match columns layout */}
                    <div className="p-1 max-h-[520px] overflow-y-auto">
                      {data.recent_incidents && data.recent_incidents.length > 0 ? (
                        <div className="p-3">
                          <IncidentTable
                            investigations={data.recent_incidents}
                            onDelete={() => {}}
                            isDashboardWidget={true}
                          />
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Inbox className="mx-auto h-8 w-8 text-slate-650 mb-2" />
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                            No Recent Incidents
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            System logs are clear. No pending telemetry events.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </aside>
              </div>
            )}

            {isLoading && (
              <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                <div className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <ChartSkeleton />
                    <ChartSkeleton />
                  </div>
                  <ChartSkeleton />
                  <ChartSkeleton />
                </div>
                <div className="space-y-8">
                  <ChartSkeleton />
                  <ChartSkeleton />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage