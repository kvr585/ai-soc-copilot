function ErrorCard({ message, onRetry }) {
  return (
    <section className="rounded-3xl border border-soc-border bg-[#1F2937] p-6 shadow-soc">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Connection Error</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Unable to load dashboard</h2>
        </div>
        <p className="text-sm leading-7 text-slate-300">{message || 'There was an issue communicating with the backend service.'}</p>
        <button
          type="button"
          onClick={onRetry}
          className="w-fit rounded-2xl bg-soc-primary px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Retry
        </button>
      </div>
    </section>
  )
}

export default ErrorCard
