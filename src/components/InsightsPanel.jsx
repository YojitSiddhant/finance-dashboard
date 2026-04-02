const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function InsightCard({ icon, title, value, tone = 'default', subtitle }) {
  const toneStyles = {
    default: 'text-slate-900 dark:text-white',
    positive: 'text-emerald-600 dark:text-emerald-400',
    negative: 'text-rose-600 dark:text-rose-400',
  }

  return (
    <article className="hover-sheen rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className={`mt-3 text-xl font-bold tracking-tight sm:mt-4 sm:text-2xl ${toneStyles[tone]}`}>
            {value}
          </p>
        </div>
        <span className="mt-0.5 text-xs font-semibold text-slate-400 dark:text-slate-500 sm:text-sm">{icon}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:mt-4">{subtitle}</p>
    </article>
  )
}

function InsightsPanel({ insights }) {
  if (!insights) {
    return (
      <aside className="animate-enter-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Insights</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">No insights available</p>
      </aside>
    )
  }

  const { highestSpendingCategory, monthlyComparison, totalTransactions } = insights
  const hasInsights = totalTransactions > 0

  if (!hasInsights) {
    return (
      <aside className="animate-enter-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Insights</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">No insights available</p>
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          Add more transaction history to unlock spending insights.
        </div>
      </aside>
    )
  }

  const isExpenseIncrease = monthlyComparison.changePercentage > 0
  const changeTone =
    monthlyComparison.changePercentage > 0
      ? 'negative'
      : monthlyComparison.changePercentage < 0
        ? 'positive'
        : 'default'

  return (
    <aside className="animate-enter-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <h2 className="text-center text-lg font-semibold text-slate-900 dark:text-white">Insights</h2>
      <p className="mt-1 text-center text-sm text-slate-600 dark:text-slate-300">
        Quick signals based on your current transaction activity.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1 2xl:gap-4">
        <InsightCard
          icon="Top Category"
          title="Highest Spending Category"
          value={highestSpendingCategory ? highestSpendingCategory.name : 'No expense data'}
          subtitle={
            highestSpendingCategory
              ? `${currencyFormatter.format(highestSpendingCategory.value)} spent in this category.`
              : 'No expense transactions available yet.'
          }
        />
        <InsightCard
          icon={isExpenseIncrease ? 'Expense Up' : 'Expense Down'}
          title="Monthly Expense Change"
          value={`${Math.abs(monthlyComparison.changePercentage).toFixed(1)}%`}
          tone={changeTone}
          subtitle={`${isExpenseIncrease ? 'Increase' : 'Decrease'} from prior month. Current: ${currencyFormatter.format(
            monthlyComparison.currentMonth,
          )} | Previous: ${currencyFormatter.format(monthlyComparison.previousMonth)}`}
        />
        <InsightCard
          icon="Volume"
          title="Total Transactions"
          value={String(totalTransactions)}
          subtitle="All recorded income and expense entries in the dashboard."
        />
      </div>
    </aside>
  )
}

export default InsightsPanel
