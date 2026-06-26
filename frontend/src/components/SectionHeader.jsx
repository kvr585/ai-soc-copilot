function SectionHeader({ title, subtitle, caption }) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">{subtitle}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">{title}</h2>
        </div>
      </div>
      {caption ? <p className="text-sm text-slate-400">{caption}</p> : null}
    </div>
  )
}

export default SectionHeader
