function SummaryCard({ summary }) {
  return (
    <section className="rounded-3xl border border-soc-border bg-soc-card p-6 shadow-soc">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Executive Summary</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-100">Incident overview</h2>
      </div>
      <div className="rounded-3xl border border-soc-border bg-[#111827]/90 p-6">
        <p className="text-base leading-8 text-slate-200">{summary ?? 'No executive summary available.'}</p>
      </div>
    </section>
  )
}

export default SummaryCard
