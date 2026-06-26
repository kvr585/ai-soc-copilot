import SectionHeader from './SectionHeader.jsx'

function PlanList({ title, items }) {
  return (
    <div className="rounded-3xl border border-soc-border bg-[#111827]/80 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      {Array.isArray(items) && items.length > 0 ? (
        <ul className="mt-4 space-y-2 text-sm text-slate-200">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-soc-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-400">None Detected</p>
      )}
    </div>
  )
}

function ResponsePlanCard({ plan }) {
  const priority = plan?.priority ?? 'Unknown'
  const impact = plan?.estimated_impact ?? 'Unknown'

  return (
    <section className="rounded-3xl border border-soc-border bg-soc-card p-6 shadow-soc">
      <SectionHeader title="AI Response Plan" subtitle="Incident response playbook" caption="Actionable guidance generated from the investigation." />

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-soc-border bg-[#111827]/80 p-5">
          <p className="text-sm text-slate-400">Priority</p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">{priority}</p>
        </div>
        <div className="rounded-3xl border border-soc-border bg-[#111827]/80 p-5">
          <p className="text-sm text-slate-400">Estimated Impact</p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">{impact}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PlanList title="Containment" items={plan?.containment} />
        <PlanList title="Eradication" items={plan?.eradication} />
        <PlanList title="Recovery" items={plan?.recovery} />
        <PlanList title="Recommendations" items={plan?.recommendations} />
      </div>
    </section>
  )
}

export default ResponsePlanCard
