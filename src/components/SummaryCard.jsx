const typeStyles = {
  income: {
    accent: 'text-emerald-600 dark:text-emerald-400',
    badge:
      'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
    iconWrap:
      'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
    shape: 'bg-emerald-500/10 dark:bg-emerald-400/10',
  },
  expense: {
    accent: 'text-rose-600 dark:text-rose-400',
    badge:
      'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30',
    iconWrap:
      'bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20',
    shape: 'bg-rose-500/10 dark:bg-rose-400/10',
  },
  balance: {
    accent: 'text-blue-600 dark:text-blue-400',
    badge:
      'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/30',
    iconWrap:
      'bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20',
    shape: 'bg-blue-500/10 dark:bg-blue-400/10',
  },
}

function CardIcon({ type }) {
  if (type === 'income') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M12 19V5" strokeLinecap="round" />
        <path d="m6 11 6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'expense') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M12 5v14" strokeLinecap="round" />
        <path d="m18 13-6 6-6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M4 15.5 9 10l3.2 3.2L20 5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 5.5H20v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SummaryCard({ title, amount, type, className = '' }) {
  const styles = typeStyles[type] ?? typeStyles.balance

  return (
    <article
      className={`hover-sheen group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-5 lg:p-6 ${className}`}
    >
      <div
        className={`pointer-events-none absolute -right-6 top-16 h-28 w-28 rounded-full blur-2xl ${styles.shape}`}
      />
      <div
        className={`pointer-events-none absolute -left-6 bottom-5 h-16 w-16 rounded-full blur-xl ${styles.shape}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3 ${styles.iconWrap}`}
          >
            <CardIcon type={type} />
          </span>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles.badge}`}
        >
          {type}
        </span>
      </div>

      <p
        className={`relative mt-4 min-w-0 text-center text-[clamp(1.9rem,7vw,2.4rem)] font-bold tracking-tight sm:mt-5 sm:text-3xl ${styles.accent}`}
      >
        {amount}
      </p>
    </article>
  )
}

export default SummaryCard
