import { NavLink } from 'react-router-dom'
import { ShieldAlert, ShieldCheck, Globe, Settings2, X, Terminal, Search } from 'lucide-react'
import { useSidebar } from '../context/SidebarContext.jsx'
import { motion } from 'framer-motion'

const navLinks = [
  { label: 'Dashboard', icon: ShieldCheck, to: '/' },
  { label: 'Investigate', icon: Search, to: '/investigate' },
  { label: 'Incidents', icon: ShieldAlert, to: '/incidents' },
  { label: 'Threat Intel', icon: Globe, to: '/threat-intel' },
  { label: 'Console Config', icon: Settings2 }
]

function Sidebar() {
  const { sidebarOpen, closeSidebar } = useSidebar()

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[240px] flex flex-col justify-between border-r border-slate-800 bg-[#0B1220]/95 p-5.5 shadow-2xl transition-transform duration-300 ease-in-out lg:sticky lg:top-24 lg:z-0 lg:h-[calc(100vh-120px)] lg:w-full lg:translate-x-0 lg:rounded-3xl lg:border lg:border-slate-850 lg:bg-[#111827]/30 lg:backdrop-blur-md lg:shadow-soc ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-soc-primary" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Navigation</p>
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Links */}
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              if (link.to) {
                return (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    className="group block relative rounded-2xl"
                  >
                    {({ isActive }) => (
                      <div
                        className={`relative z-10 flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? 'text-slate-950 font-bold'
                            : 'text-slate-455 hover:bg-slate-900/15 hover:text-slate-200'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active-indicator"
                            className="absolute inset-0 -z-10 rounded-2xl bg-soc-primary shadow-cyan-glow"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <Icon
                          className={`h-4.5 w-4.5 transition-colors duration-200 ${
                            isActive ? 'text-slate-950' : 'text-slate-500 group-hover:text-slate-350'
                          }`}
                        />
                        {link.label}
                      </div>
                    )}
                  </NavLink>
                )
              }

              return (
                <div
                  key={link.label}
                  className="flex w-full items-center gap-3 rounded-2xl border border-transparent px-4 py-3.5 text-left text-xs font-semibold text-slate-600 cursor-not-allowed select-none"
                >
                  <Icon className="h-4.5 w-4.5 text-slate-700" />
                  {link.label}
                  <span className="ml-auto text-[7.5px] font-extrabold uppercase tracking-wider text-soc-primary/80 bg-soc-primary/10 border border-soc-primary/20 px-1.5 py-0.5 rounded">
                    Soon
                  </span>
                </div>
              )
            })}
          </nav>
        </div>

        {/* Footer info inside sidebar */}
        <div className="border-t border-slate-850 pt-4 mt-6">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-900/40 p-3 border border-slate-800/40">
            <div className="h-2 w-2 rounded-full bg-soc-success animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200">Terminal Sec-V1</span>
              <span className="text-[10px] text-slate-500">Encrypted Tunnel Active</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
