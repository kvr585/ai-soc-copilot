function LogCard({ logs }) {
  const metrics = [
    { label: 'Failed Logins', value: logs?.failed_logins ?? 0, status: logs?.failed_logins > 0 },
    { label: 'PowerShell', value: logs?.powershell ? 'Yes' : 'No', status: logs?.powershell },
    { label: 'VPN Login', value: logs?.vpn_login ? 'Yes' : 'No', status: logs?.vpn_login },
    { label: 'New User', value: logs?.new_user ? 'Yes' : 'No', status: logs?.new_user }
  ]

  return (
    <section className="rounded-3xl border border-soc-border bg-soc-card p-6 shadow-soc">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Log Analysis</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-100">Behavioral indicators</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-3xl border border-soc-border bg-[#111827]/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-400">{metric.label}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${metric.status ? 'bg-soc-success/15 text-soc-success' : 'bg-soc-danger/15 text-soc-danger'}`}>
                {metric.status ? 'Detected' : 'Not Detected'}
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-slate-100">{metric.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default LogCard
