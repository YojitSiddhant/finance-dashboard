import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const emptyForm = {
  date: '',
  description: '',
  category: '',
  type: 'expense',
  amount: '',
}

function TransactionsSection({
  transactions,
  role,
  onAddTransaction,
  onEditTransaction,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortOption, setSortOption] = useState('date-latest')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formError, setFormError] = useState('')

  const isAdmin = role === 'admin'

  const categories = useMemo(() => {
    return [...new Set(transactions.map((transaction) => transaction.category))].sort()
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const filtered = transactions.filter((transaction) => {
      const matchesSearch = normalizedSearch
        ? transaction.description.toLowerCase().includes(normalizedSearch)
        : true
      const matchesType =
        selectedType === 'all' ? true : transaction.type === selectedType
      const matchesCategory =
        selectedCategory === 'all'
          ? true
          : transaction.category === selectedCategory

      return matchesSearch && matchesType && matchesCategory
    })

    return [...filtered].sort((firstTransaction, secondTransaction) => {
      if (sortOption === 'amount-asc') {
        return firstTransaction.amount - secondTransaction.amount
      }

      if (sortOption === 'amount-desc') {
        return secondTransaction.amount - firstTransaction.amount
      }

      if (sortOption === 'date-oldest') {
        return new Date(firstTransaction.date) - new Date(secondTransaction.date)
      }

      return new Date(secondTransaction.date) - new Date(firstTransaction.date)
    })
  }, [searchTerm, selectedCategory, selectedType, sortOption, transactions])

  const openAddModal = () => {
    setEditingTransaction(null)
    setFormData(emptyForm)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
      type: transaction.type,
      amount: String(transaction.amount),
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTransaction(null)
    setFormData(emptyForm)
    setFormError('')
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedDescription = formData.description.trim()
    const trimmedCategory = formData.category.trim()
    const amount = Number(formData.amount)

    if (
      !formData.date ||
      !trimmedDescription ||
      !trimmedCategory ||
      !formData.type ||
      !Number.isFinite(amount)
    ) {
      setFormError('Please complete all required fields.')
      return
    }

    if (amount <= 0) {
      setFormError('Amount must be positive.')
      return
    }

    const transactionPayload = {
      ...(editingTransaction ? { id: editingTransaction.id } : {}),
      date: formData.date,
      description: trimmedDescription,
      category: trimmedCategory,
      type: formData.type,
      amount,
    }

    if (editingTransaction) {
      onEditTransaction(transactionPayload)
    } else {
      onAddTransaction(transactionPayload)
    }

    closeModal()
  }

  const formatAmount = (transaction) => {
    const prefix = transaction.type === 'income' ? '+' : '-'
    return `${prefix}${currencyFormatter.format(transaction.amount)}`
  }

  const formatDate = (date) => dateFormatter.format(new Date(date))
  const getTypeBadgeClass = (type) =>
    type === 'income'
      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
      : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined
    }

    const { body, documentElement } = document

    if (!isModalOpen) {
      body.classList.remove('modal-open')
      documentElement.classList.remove('modal-open')
      return undefined
    }

    const scrollY = window.scrollY

    body.classList.add('modal-open')
    documentElement.classList.add('modal-open')
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    return () => {
      body.classList.remove('modal-open')
      documentElement.classList.remove('modal-open')
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [isModalOpen])

  const modalContent =
    isModalOpen && typeof document !== 'undefined' ? (
      <div className="fixed inset-0 z-[100] h-dvh w-screen overflow-x-hidden overflow-y-auto bg-slate-950/55">
        <div className="flex min-h-dvh items-end justify-center px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-6 sm:items-center sm:px-6 sm:py-8">
          <div className="animate-pop-in w-full max-w-[min(100%,28rem)] overflow-x-hidden overflow-y-hidden rounded-[1.75rem] border border-slate-200 bg-white px-4 pb-4 pt-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:max-w-lg sm:rounded-3xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Update the basic transaction details below.
              </p>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close modal"
            >
              x
            </button>
          </div>

            <form
              onSubmit={handleSubmit}
              className="hide-scrollbar mt-6 max-h-[calc(100dvh-9.5rem)] space-y-4 overflow-x-hidden overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+0.5rem)] sm:max-h-[min(78dvh,720px)]"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Date
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Type
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500"
                    required
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Description
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                className="w-full rounded-2xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 sm:px-4"
                required
              />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Category
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Enter category"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Amount
                  <input
                    type="number"
                    name="amount"
                    min="1"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500"
                    required
                  />
                </label>
              </div>

              {formError ? (
                <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {formError}
                </p>
              ) : null}

              <div className="sticky bottom-0 flex w-full flex-col-reverse gap-3 border-t border-slate-200 bg-white pb-[calc(env(safe-area-inset-bottom)+0.25rem)] pt-4 dark:border-slate-700 dark:bg-slate-900 sm:static sm:flex-row sm:justify-end sm:border-0 sm:bg-transparent sm:pb-0 sm:pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {editingTransaction ? 'Save Changes' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    ) : null

  return (
    <>
      <section className="hover-sheen animate-enter-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-5 lg:p-6">
        <div className="flex flex-col items-center gap-3 text-center 2xl:flex-row 2xl:items-end 2xl:justify-between 2xl:text-left">
          <div className="text-center 2xl:text-left">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Transactions</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Viewer can search and filter. Admin can also add and edit records.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 2xl:justify-end">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {filteredTransactions.length} records
            </span>
            {isAdmin ? (
              <button
                type="button"
                onClick={openAddModal}
                className="rounded-2xl bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-md transition duration-200 hover:scale-105 hover:bg-slate-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4"
              >
                Add Transaction
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by description"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500"
          />
          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 sm:px-4"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 sm:px-4"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 sm:px-4"
          >
            <option value="date-latest">Date: Latest first</option>
            <option value="date-oldest">Date: Oldest first</option>
            <option value="amount-asc">Amount: Low to high</option>
            <option value="amount-desc">Amount: High to low</option>
          </select>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            No transactions found for the current filters.
          </div>
        ) : (
          <>
            <div className="mt-5 hidden overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 lg:block">
              <div className="max-h-[400px] overflow-y-auto px-2 py-2">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800">
                    <tr className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Amount</th>
                      {isAdmin ? <th className="px-4 py-3">Action</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="text-center text-sm text-slate-700 transition-colors duration-200 odd:bg-white even:bg-slate-50/60 hover:bg-slate-100/80 dark:text-slate-200 dark:odd:bg-slate-900 dark:even:bg-slate-800/60 dark:hover:bg-slate-800"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                          {transaction.description}
                        </td>
                        <td className="px-4 py-4">{transaction.category}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getTypeBadgeClass(transaction.type)}`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-4 font-medium whitespace-nowrap ${
                            transaction.type === 'income'
                              ? 'text-emerald-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {formatAmount(transaction)}
                        </td>
                        {isAdmin ? (
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => openEditModal(transaction)}
                              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                              Edit
                            </button>
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5 grid gap-3 lg:hidden">
              {filteredTransactions.map((transaction) => (
                <article
                  key={transaction.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 sm:p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getTypeBadgeClass(transaction.type)}`}
                    >
                      {transaction.type}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>{transaction.category}</span>
                    <span
                      className={`font-medium ${
                        transaction.type === 'income'
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {formatAmount(transaction)}
                    </span>
                  </div>

                  {isAdmin ? (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => openEditModal(transaction)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        Edit
                      </button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {modalContent ? createPortal(modalContent, document.body) : null}
    </>
  )
}

export default TransactionsSection
