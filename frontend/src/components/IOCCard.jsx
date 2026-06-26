import { ExternalLink, User, Globe2, Hash, ServerCog, ShieldCheck } from 'lucide-react'
import SectionHeader from './SectionHeader.jsx'

const categories = [
  { title: 'IP Addresses', key: 'ips', icon: ExternalLink },
  { title: 'Users', key: 'users', icon: User },
  { title: 'Countries', key: 'countries', icon: Globe2 },
  { title: 'Organizations', key: 'organizations', icon: ServerCog },
  { title: 'Domains', key: 'domains', icon: ExternalLink },
  { title: 'URLs', key: 'urls', icon: ExternalLink },
  { title: 'Emails', key: 'emails', icon: ShieldCheck },
  { title: 'Hashes', key: 'hashes', icon: Hash }
]

function IOCCard({ iocs }) {
  return (
    <section className="rounded-3xl border border-soc-border bg-soc-card p-6 shadow-soc">
      <SectionHeader title="IOC Extraction" subtitle="Detected indicators" caption="Extracted observables from the incident."></SectionHeader>
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => {
          const Icon = category.icon
          const values = Array.isArray(iocs?.[category.key]) ? iocs[category.key] : []

          return (
            <div key={category.key} className="rounded-3xl border border-soc-border bg-[#111827]/80 p-5">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-soc-background text-soc-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-400">{category.title}</p>
              {values.length > 0 ? (
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  {values.map((value) => (
                    <li key={value} className="rounded-2xl border border-soc-border bg-soc-card/90 px-3 py-2">{value}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-400">None Detected</p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default IOCCard
