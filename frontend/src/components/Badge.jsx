function Badge({ label, variant = 'primary' }) {
  const variants = {
    primary: 'bg-soc-primary/15 text-soc-primary',
    success: 'bg-soc-success/15 text-soc-success',
    warning: 'bg-soc-warning/15 text-soc-warning',
    danger: 'bg-soc-danger/15 text-soc-danger'
  }

  return (
    <span className={`inline-flex rounded-full border border-soc-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${variants[variant] ?? variants.primary}`}>
      {label}
    </span>
  )
}

export default Badge
