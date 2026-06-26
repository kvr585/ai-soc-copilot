import { useEffect, useState } from 'react'
import { motion, animate } from 'framer-motion'

// Smooth count-up animation for numeric values
function AnimatedCounter({ value }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    const numericValue = parseFloat(value)
    if (isNaN(numericValue)) {
      setDisplayValue(value)
      return
    }

    const controls = animate(0, numericValue, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate(current) {
        setDisplayValue(Math.round(current))
      }
    })

    return () => controls.stop()
  }, [value])

  return <>{displayValue}</>
}

function StatCard({ title, value, icon: Icon, accentClass = 'bg-cyan-500', trend }) {
  // Map Tailwind bg colors to custom accent rings and glows
  let color = 'cyan';
  if (accentClass.includes('red')) color = 'red';
  else if (accentClass.includes('orange')) color = 'orange';
  else if (accentClass.includes('yellow')) color = 'yellow';
  else if (accentClass.includes('purple')) color = 'purple';
  else if (accentClass.includes('indigo')) color = 'indigo';

  const hoverBorders = {
    cyan: 'hover:border-cyan-500/35 hover:shadow-cyan-950/15',
    red: 'hover:border-red-500/35 hover:shadow-red-950/15',
    orange: 'hover:border-orange-500/35 hover:shadow-orange-950/15',
    yellow: 'hover:border-yellow-500/35 hover:shadow-yellow-950/15',
    purple: 'hover:border-purple-500/35 hover:shadow-purple-950/15',
    indigo: 'hover:border-indigo-500/35 hover:shadow-indigo-950/15',
  };

  const glows = {
    cyan: 'bg-cyan-500/5',
    red: 'bg-red-500/5',
    orange: 'bg-orange-500/5',
    yellow: 'bg-yellow-500/5',
    purple: 'bg-purple-500/5',
    indigo: 'bg-indigo-500/5',
  };

  const hoverBorder = hoverBorders[color] || hoverBorders.cyan;
  const glowBg = glows[color] || glows.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl border border-slate-800/80 bg-[#111827]/40 p-3.5 shadow-md backdrop-blur-sm transition-all duration-300 ${hoverBorder} hover:-translate-y-1 hover:shadow-lg group flex flex-col justify-between min-h-[90px]`}
    >
      {/* Dynamic corner glow decorator */}
      <div className={`absolute -right-4 -bottom-4 h-20 w-20 rounded-full filter blur-xl opacity-20 transition-opacity duration-300 group-hover:opacity-30 ${glowBg}`} />

      {/* Top section: Title & Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 leading-tight block">
          {title}
        </span>
        {Icon && (
          <Icon className="h-4 w-4 text-slate-500 group-hover:text-soc-primary shrink-0 transition-colors duration-300" />
        )}
      </div>

      {/* Bottom section: Value & Trend */}
      <div className="mt-2 flex items-baseline justify-between gap-1.5 min-w-0">
        <span className="text-2xl font-extrabold tracking-tight text-slate-100 block truncate">
          <AnimatedCounter value={value} />
        </span>
        {trend && (
          <span className={`text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md border shrink-0 transition-all ${
            trend.type === 'up' 
              ? 'bg-red-500/10 border-red-500/20 text-red-400 shadow-red-glow/5' 
              : 'bg-green-500/10 border-green-500/20 text-green-400'
          }`}>
            {trend.value}
          </span>
        )}
      </div>

      {/* Top Border Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] transition-colors ${accentClass}`} />
    </motion.div>
  )
}

export default StatCard
