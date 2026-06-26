import { useEffect, useState } from 'react'
import { Bell, Cpu, Moon, Menu, Activity } from 'lucide-react'
import { useSidebar } from '../context/SidebarContext.jsx'

function Navbar({ backendStatus }) {
  const [time, setTime] = useState(new Date())
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Format dual clock strings
  const utcTimeStr = time.toUTCString().slice(17, 25)
  const localTimeStr = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  const isOnline = backendStatus?.online ?? true

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0B1220]/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-none items-center justify-between px-6 xl:px-10">
        
        {/* Left Side: Brand Logo and Mobile Drawer Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-850 bg-[#111827]/40 text-slate-400 transition hover:bg-[#111827]/80 hover:text-slate-200 lg:hidden"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
          
          <div className="flex items-center gap-3 text-slate-100">
            <Activity className="h-6 w-6 text-soc-primary shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400 font-bold leading-none mb-1">AI SOC Copilot</p>
              <h1 className="text-lg font-bold tracking-tight text-slate-150 leading-tight sm:text-xl">Security Operations Center</h1>
            </div>
          </div>
        </div>

        {/* Right Side: Metrics & Status */}
        <div className="flex items-center gap-3">
          
          {/* Dual Clock (UTC + LOC) */}
          <div className="hidden md:inline-flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-[#111827]/30 px-4 py-2 font-mono text-xs text-slate-400">
            <Cpu className="h-4 w-4 text-soc-primary/80" />
            <span>UTC: <strong className="text-slate-100 font-bold">{utcTimeStr}</strong></span>
            <span className="text-slate-800">|</span>
            <span>LOC: <strong className="text-slate-100 font-bold">{localTimeStr}</strong></span>
          </div>

          {/* Backend Status indicator with Pulse animation */}
          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-[#111827]/30 px-3.5 py-2 text-xs font-semibold text-slate-350">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${isOnline ? 'bg-soc-success' : 'bg-soc-danger'}`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${isOnline ? 'bg-soc-success' : 'bg-soc-danger'}`} />
            </span>
            <span className="hidden sm:inline">Backend: {isOnline ? 'Active' : 'Offline'}</span>
          </div>

          {/* Notifications Placeholder with active simulated badge */}
          <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800/80 bg-[#111827]/40 text-slate-455 hover:text-slate-200 transition cursor-pointer hover:border-slate-700">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-soc-danger text-[9px] font-extrabold text-white ring-2 ring-[#0B1220] shadow-red-glow">
              3
            </span>
          </div>

          {/* Dark Secure Mode Theme Indicator */}
          <div
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800/80 bg-[#111827]/40 text-soc-primary transition hover:bg-slate-900/60 hover:border-slate-700 cursor-pointer"
            title="Dark Secure Mode Enabled"
          >
            <Moon className="h-4.5 w-4.5 text-soc-primary fill-soc-primary/10" />
          </div>

        </div>

      </div>
    </header>
  )
}

export default Navbar
