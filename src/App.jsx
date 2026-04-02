import { useEffect, useLayoutEffect, useState } from 'react'
import ChartsSection from './components/ChartsSection'
import Header from './components/Header'
import InsightsPanel from './components/InsightsPanel'
import RoleSwitcher from './components/RoleSwitcher'
import SummaryCard from './components/SummaryCard'
import TransactionsSection from './components/TransactionsSection'
import initialTransactions from './data/transactions'
import {
  calculateBalance,
  calculateTotalExpenses,
  calculateTotalIncome,
  getCategoryData,
  getHighestSpendingCategory,
  getMonthlyData,
  getMonthlyComparison,
  getTotalTransactions,
} from './utils/finance'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function LoadingCard({ className = '' }) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 lg:p-6 ${className}`}
    >
      <div className="skeleton-line h-4 w-24 rounded-full" />
      <div className="skeleton-line mt-4 h-9 w-40 rounded-2xl" />
      <div className="skeleton-line mt-6 h-24 w-full rounded-3xl" />
    </div>
  )
}

function LoadingDashboard() {
  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 transition-colors duration-200 dark:bg-slate-950 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-5 lg:gap-7">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:p-8">
          <div className="skeleton-line h-3 w-24 rounded-full" />
          <div className="skeleton-line mt-4 h-10 w-72 max-w-full rounded-2xl" />
          <div className="skeleton-line mt-4 h-5 w-full max-w-2xl rounded-full" />
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <div className="skeleton-line h-4 w-32 rounded-full" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="skeleton-line h-16 rounded-2xl" />
            <div className="skeleton-line h-16 rounded-2xl" />
          </div>
        </div>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard className="sm:col-span-2 lg:col-span-1" />
        </section>

        <section className="grid gap-4 xl:grid-cols-2 xl:gap-6">
          <LoadingCard />
          <LoadingCard />
        </section>

        <section className="grid gap-4 lg:gap-5 2xl:grid-cols-[1.45fr_1fr]">
          <LoadingCard className="min-h-80" />
          <LoadingCard />
        </section>
      </div>
    </main>
  )
}

function App() {
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem('finance-dashboard-theme') === 'dark'
  })
  const [selectedRole, setSelectedRole] = useState('viewer')
  const [transactions, setTransactions] = useState(() => {
    if (typeof window === 'undefined') {
      return initialTransactions
    }

    const savedTransactions = window.localStorage.getItem(
      'finance-dashboard-transactions',
    )

    if (!savedTransactions) {
      return initialTransactions
    }

    try {
      return JSON.parse(savedTransactions)
    } catch {
      return initialTransactions
    }
  })

  const totalIncome = calculateTotalIncome(transactions)
  const totalExpenses = calculateTotalExpenses(transactions)
  const balance = calculateBalance(transactions)
  const monthlyData = getMonthlyData(transactions)
  const categoryData = getCategoryData(transactions)
  const highestSpendingCategory = getHighestSpendingCategory(transactions)
  const monthlyComparison = getMonthlyComparison(transactions)
  const totalTransactions = getTotalTransactions(transactions)

  useEffect(() => {
    window.localStorage.setItem(
      'finance-dashboard-transactions',
      JSON.stringify(transactions),
    )
  }, [transactions])

  useLayoutEffect(() => {
    const root = window.document.documentElement

    root.classList.toggle('dark', isDarkMode)
    window.localStorage.setItem(
      'finance-dashboard-theme',
      isDarkMode ? 'dark' : 'light',
    )
  }, [isDarkMode])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsPageLoading(false)
    }, 550)

    return () => window.clearTimeout(timer)
  }, [])

  const handleAddTransaction = (transaction) => {
    setTransactions((currentTransactions) => {
      const nextTransactionId = currentTransactions.reduce(
        (highestId, currentTransaction) =>
          Math.max(highestId, currentTransaction.id),
        0,
      )

      return [
        {
          ...transaction,
          id: nextTransactionId + 1,
        },
        ...currentTransactions,
      ]
    })
  }

  const handleEditTransaction = (updatedTransaction) => {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction,
      ),
    )
  }

  const handleResetDemoData = () => {
    setTransactions(initialTransactions)
    setSelectedRole('viewer')
    window.localStorage.setItem(
      'finance-dashboard-transactions',
      JSON.stringify(initialTransactions),
    )
  }

  if (isPageLoading) {
    return <LoadingDashboard />
  }

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 transition-colors duration-200 dark:bg-slate-950 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-5 lg:gap-7">
        <Header
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((currentTheme) => !currentTheme)}
          onResetDemoData={handleResetDemoData}
        />
        <RoleSwitcher
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          <SummaryCard
            title="Total Balance"
            amount={currencyFormatter.format(balance || 0)}
            type="balance"
            className="animate-enter-2"
          />
          <SummaryCard
            title="Total Income"
            amount={currencyFormatter.format(totalIncome || 0)}
            type="income"
            className="animate-enter-3"
          />
          <SummaryCard
            title="Total Expenses"
            amount={currencyFormatter.format(totalExpenses || 0)}
            type="expense"
            className="animate-enter-4"
          />
        </section>

        <ChartsSection monthlyData={monthlyData} categoryData={categoryData} />

        <section className="grid gap-4 lg:gap-5 2xl:grid-cols-[1.45fr_1fr]">
          <TransactionsSection
            transactions={transactions}
            role={selectedRole}
            onAddTransaction={handleAddTransaction}
            onEditTransaction={handleEditTransaction}
          />
          <InsightsPanel
            insights={{
              highestSpendingCategory,
              monthlyComparison,
              totalTransactions,
            }}
          />
        </section>

        <footer className="animate-enter-5 border-t border-slate-200/80 pt-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Website created by{' '}
          <span className="font-medium text-slate-700 dark:text-slate-200">
            Siddhant Yojit
          </span>{' '}
          ·{' '}
          <a
            href="https://www.linkedin.com/in/siddhant-yojit-ab805327b/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-blue-600 underline-offset-4 transition hover:text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            LinkedIn Profile
          </a>
        </footer>
      </div>
    </main>
  )
}

export default App
