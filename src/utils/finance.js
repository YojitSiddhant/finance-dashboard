export function calculateTotalIncome(transactions = []) {
  return transactions.reduce((total, transaction) => {
    if (transaction.type !== 'income') {
      return total
    }

    return total + (transaction.amount || 0)
  }, 0)
}

export function calculateTotalExpenses(transactions = []) {
  return transactions.reduce((total, transaction) => {
    if (transaction.type !== 'expense') {
      return total
    }

    return total + (transaction.amount || 0)
  }, 0)
}

export function calculateBalance(transactions = []) {
  const income = calculateTotalIncome(transactions)
  const expenses = calculateTotalExpenses(transactions)

  return income - expenses
}

export function getMonthlyData(transactions = []) {
  const monthlyMap = transactions.reduce((accumulator, transaction) => {
    if (!transaction.date) {
      return accumulator
    }

    const date = new Date(transaction.date)

    if (Number.isNaN(date.getTime())) {
      return accumulator
    }

    const year = date.getFullYear()
    const month = date.getMonth()
    const key = `${year}-${String(month + 1).padStart(2, '0')}`

    if (!accumulator[key]) {
      accumulator[key] = {
        month: date.toLocaleString('en-US', { month: 'short' }),
        income: 0,
        expense: 0,
        timestamp: new Date(year, month, 1).getTime(),
      }
    }

    if (transaction.type === 'income') {
      accumulator[key].income += transaction.amount || 0
    }

    if (transaction.type === 'expense') {
      accumulator[key].expense += transaction.amount || 0
    }

    return accumulator
  }, {})

  return Object.values(monthlyMap)
    .sort((firstMonth, secondMonth) => firstMonth.timestamp - secondMonth.timestamp)
    .map(({ timestamp, ...monthData }) => monthData)
}

export function getCategoryData(transactions = []) {
  const categoryMap = transactions.reduce((accumulator, transaction) => {
    if (transaction.type !== 'expense') {
      return accumulator
    }

    const category = transaction.category || 'Other'

    accumulator[category] = (accumulator[category] || 0) + (transaction.amount || 0)

    return accumulator
  }, {})

  return Object.entries(categoryMap)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((firstCategory, secondCategory) => secondCategory.value - firstCategory.value)
}

export function getHighestSpendingCategory(transactions = []) {
  const categoryData = getCategoryData(transactions)

  if (categoryData.length === 0) {
    return null
  }

  return categoryData.reduce((highestCategory, currentCategory) => {
    if (!highestCategory || currentCategory.value > highestCategory.value) {
      return currentCategory
    }

    return highestCategory
  }, null)
}

export function getMonthlyComparison(transactions = []) {
  const monthlyExpenseMap = transactions.reduce((accumulator, transaction) => {
    if (transaction.type !== 'expense' || !transaction.date) {
      return accumulator
    }

    const date = new Date(transaction.date)

    if (Number.isNaN(date.getTime())) {
      return accumulator
    }

    const key = `${date.getFullYear()}-${date.getMonth()}`

    accumulator[key] = {
      total: (accumulator[key]?.total || 0) + (transaction.amount || 0),
      timestamp: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
    }

    return accumulator
  }, {})

  const sortedMonths = Object.values(monthlyExpenseMap).sort(
    (firstMonth, secondMonth) => firstMonth.timestamp - secondMonth.timestamp,
  )

  const currentMonth = sortedMonths.at(-1)?.total || 0
  const previousMonth = sortedMonths.at(-2)?.total || 0

  if (previousMonth === 0) {
    return {
      currentMonth,
      previousMonth,
      changePercentage: currentMonth > 0 ? 100 : 0,
    }
  }

  return {
    currentMonth,
    previousMonth,
    changePercentage: ((currentMonth - previousMonth) / previousMonth) * 100,
  }
}

export function getTotalTransactions(transactions = []) {
  return transactions.length
}
