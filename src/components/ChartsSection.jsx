import { useState } from 'react'
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

function EmptyState({ title, description }) {
  return (
    <div className="mt-6 flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
      <div className="text-center">
        <p className="text-slate-500 dark:text-slate-300">{title}</p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{description}</p>
      </div>
    </div>
  )
}

function ChartCard({ title, description, children, centered = false }) {
  return (
    <article className="hover-sheen animate-enter-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-5 lg:p-6">
      <h2
        className={`text-lg font-semibold text-slate-900 dark:text-white ${
          centered ? 'text-center' : ''
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-1 text-sm text-slate-600 dark:text-slate-300 ${
          centered ? 'text-center' : ''
        }`}
      >
        {description}
      </p>
      {children}
    </article>
  )
}

function renderActiveShape(props) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props

  const isDarkMode =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isDarkMode ? '#f8fafc' : '#0f172a'}
        fontSize="12"
        fontWeight="600"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isDarkMode ? '#94a3b8' : '#64748b'}
        fontSize="11"
      >
        {currencyFormatter.format(value)}
      </text>
    </g>
  )
}

function LineChartTooltip({ active, payload }) {
  const isDarkMode =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')

  if (!active || !payload?.length) {
    return null
  }

  const entry = payload[0]
  const label = entry?.payload?.name ?? entry?.name ?? ''
  const value = entry?.value ?? entry?.payload?.value ?? 0

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
        borderRadius: '16px',
        boxShadow: isDarkMode
          ? '0 12px 30px rgba(2, 6, 23, 0.45)'
          : '0 12px 30px rgba(15, 23, 42, 0.12)',
        padding: '10px 14px',
      }}
    >
      <p
        style={{
          margin: 0,
          color: isDarkMode ? '#f8fafc' : '#0f172a',
          fontSize: '13px',
          fontWeight: 600,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: '4px 0 0',
          color: isDarkMode ? '#cbd5e1' : '#475569',
          fontSize: '13px',
        }}
      >
        {currencyFormatter.format(value)}
      </p>
    </div>
  )
}

function ChartsSection({ monthlyData, categoryData }) {
  const hasMonthlyData = monthlyData.length > 0
  const hasCategoryData = categoryData.length > 0
  const [activeIndex, setActiveIndex] = useState(null)
  const activeCategory =
    activeIndex === null ? null : categoryData[activeIndex] ?? null
  const isDarkMode =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')

  return (
    <section className="grid gap-4 xl:grid-cols-2 xl:gap-6">
      <ChartCard
        title="Monthly Trend"
        description="Income and expense totals grouped by month."
        centered
      >
        {hasMonthlyData ? (
          <div className="mt-5 h-64 w-full sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b' }}
                />
                <YAxis
                  width={56}
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => currencyFormatter.format(value)}
                  tick={{ fontSize: 10, fill: isDarkMode ? '#94a3b8' : '#64748b' }}
                />
                <Tooltip content={<LineChartTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 12, fontSize: 13, lineHeight: '20px' }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Expense"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            title="No data available"
            description="Add transactions to see monthly income and expense trends."
          />
        )}
      </ChartCard>

      <ChartCard
        title="Expense Categories"
        description="Breakdown of expenses by category."
        centered
      >
        {hasCategoryData ? (
          <div className="mt-5">
            <div className="h-64 w-full sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex ?? 0}
                    activeShape={renderActiveShape}
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={92}
                    innerRadius={56}
                    paddingAngle={3}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${entry.value}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={() => null} cursor={false} />
                  <Legend
                    wrapperStyle={{ paddingTop: 12, fontSize: 13, lineHeight: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="animate-pop-in mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800 sm:mt-4">
              {activeCategory ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {activeCategory.name}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {currencyFormatter.format(activeCategory.value)}
                  </span>
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  Hover over a category slice to view its amount.
                </p>
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No data available"
            description="Expense transactions will appear here once recorded."
          />
        )}
      </ChartCard>
    </section>
  )
}

export default ChartsSection
