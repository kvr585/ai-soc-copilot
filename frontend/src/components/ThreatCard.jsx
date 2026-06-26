import { MapPin, Globe2, Shield, ServerCog, Gauge } from 'lucide-react'

function ThreatCard({ threat }) {
  const details = [
    { label: 'IP', value: threat?.ip ?? 'Unknown', icon: MapPin },
    { label: 'Country', value: threat?.country ?? 'Unknown', icon: Globe2 },
    { label: 'City', value: threat?.city ?? 'Unknown', icon: Shield },
    { label: 'ISP', value: threat?.isp ?? 'Unknown', icon: ServerCog },
    { label: 'Organization', value: threat?.organization ?? 'Unknown', icon: Globe2 },
    { label: 'Timezone', value: threat?.timezone ?? 'Unknown', icon: Gauge }
  ]

  return (
    <section className="rounded-3xl border border-soc-border bg-soc-card p-6 shadow-soc">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Threat Intelligence</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Network footprint</h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {details.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="rounded-3xl border border-soc-border bg-[#111827]/80 p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-soc-background text-soc-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-slate-100">{item.value}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ThreatCard
