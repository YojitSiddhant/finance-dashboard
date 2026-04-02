function Header({ isDarkMode, onToggleDarkMode, onResetDemoData }) {
  return (
    <header className="hover-sheen animate-enter-1 rounded-3xl border border-slate-200 bg-white px-4 py-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="text-center md:max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400 sm:text-sm">
              Overview
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:mt-3 sm:text-4xl lg:text-5xl">
              Finance Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:mt-4 sm:text-base">
              A clean starting point for financial reporting, team views, and quick
              operational insights.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 self-start sm:grid-cols-2 lg:w-auto lg:min-w-[220px] lg:grid-cols-1 lg:items-end">
            <button
              type="button"
              onClick={onResetDemoData}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              Reset Demo Data
            </button>
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-pressed={isDarkMode}
              aria-label="Toggle dark mode"
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 ease-out hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 lg:w-auto"
            >
              <span>Dark Mode</span>
              <span
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-out ${
                  isDarkMode ? 'bg-blue-500 shadow-sm shadow-blue-500/30' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-all duration-300 ease-out will-change-transform ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
