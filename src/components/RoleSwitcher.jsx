const roles = [
  {
    label: 'Viewer',
    value: 'viewer',
    description: 'Browse metrics, charts, and transaction history.',
  },
  {
    label: 'Admin',
    value: 'admin',
    description: 'Manage transactions with add and edit access.',
  },
]

function RoleSwitcher({ selectedRole, setSelectedRole }) {
  const activeRole = roles.find((role) => role.value === selectedRole) ?? roles[0]

  return (
    <section className="hover-sheen animate-enter-2 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Access Control
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
            Role Switcher
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Switch between read-only dashboard access and admin editing controls.
          </p>
        </div>

        <div className="w-full xl:max-w-xl">
          <div className="mx-auto max-w-md rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
            <div className="grid grid-cols-2 gap-1.5">
              {roles.map((role) => {
                const isActive = role.value === selectedRole

                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`rounded-xl px-4 py-3 text-center transition-all duration-300 ease-out ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-slate-700 dark:text-white dark:ring-slate-600'
                        : 'text-slate-500 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/70 dark:hover:text-white'
                    }`}
                  >
                    <span className="block text-sm font-semibold">{role.label}</span>
                    <span className="mt-1 hidden text-xs leading-5 text-inherit/80 sm:block">
                      {role.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mx-auto mt-3 max-w-md rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-white">Current role:</span>{' '}
            {activeRole.label}
            <span className="hidden text-slate-500 dark:text-slate-400 sm:inline"> - {activeRole.description}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RoleSwitcher
