function RecommendationCard({ item }) {
  const Icon = item.icon
  return (
    <div className="rounded-3xl border border-soc-border bg-[#111827]/90 p-5 transition hover:-translate-y-1 hover:border-soc-primary hover:shadow-soc">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-soc-background text-soc-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-100">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
    </div>
  )
}

export default RecommendationCard
