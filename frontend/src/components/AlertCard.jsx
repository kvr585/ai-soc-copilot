function AlertCard({ alert }) {
  return (
    <section className="rounded-3xl border border-soc-border bg-soc-card p-6 shadow-soc">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Alert Analysis</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Threat interpretation</h2>
        </div>
        <span className="rounded-2xl bg-soc-background px-4 py-2 text-sm font-semibold text-slate-100 shadow-inner" style={{ borderColor: '#0f172a', borderWidth: 1, borderStyle: 'solid' }}>
          Confidence {alert?.confidence ?? '--'}%
        </span>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-soc-border bg-[#111827]/80 p-5">
          <p className="text-sm text-slate-400">Severity</p>
          <p className="mt-2 text-xl font-semibold text-slate-100">{alert?.severity ?? 'Unknown'}</p>
        </div>
        <div className="rounded-3xl border border-soc-border bg-[#111827]/80 p-5">
          <p className="text-sm text-slate-400">Category</p>
          <p className="mt-2 text-xl font-semibold text-slate-100">{alert?.category ?? 'Unknown'}</p>
        </div>
        <div className="rounded-3xl border border-soc-border bg-[#111827]/80 p-5">
          <p className="text-sm text-slate-400">Reason</p>
          <p className="mt-2 text-base leading-7 text-slate-200">{alert?.reason ?? 'No reason available'}</p>
        </div>
      </div>
    </section>
  )
}

export default AlertCard
