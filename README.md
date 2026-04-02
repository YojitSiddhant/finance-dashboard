# Finance Dashboard

## Project Overview

Finance Dashboard is a React + Vite frontend project for monitoring basic financial activity through a clean, responsive interface. It includes summary metrics, visual reporting, searchable transactions, role-based controls, and lightweight operational insights.

The project is intentionally frontend-only. It focuses on clear UI structure, readable component composition, and practical state-driven behavior without backend complexity.

## Features

### Summary Cards
- Displays total balance, total income, and total expenses.
- Values are calculated from transaction data in real time.
- Uses INR currency formatting for consistency.

### Charts
- Monthly income vs expense trend using a line chart.
- Expense distribution by category using a pie chart.
- Empty states are handled when chart data is unavailable.

### Transactions
- Search by description with case-insensitive matching.
- Filter by transaction type and category.
- Sort by date or amount.
- Responsive presentation with table view on desktop and card view on smaller screens.

### Role-Based UI
- Viewer role can browse the dashboard and use transaction search, filters, and sorting.
- Admin role can add new transactions and edit existing transactions through a modal form.

### Insights Section
- Shows highest spending category.
- Shows month-over-month expense change.
- Shows total number of transactions.
- Uses visual color indicators for expense increase or decrease.

## Tech Stack

- React
- Vite
- Tailwind CSS v4 via `@tailwindcss/vite`
- Recharts
- JavaScript (ES modules)

## State Management Approach

The project uses local component state with React hooks.

- `App.jsx` acts as the main state owner for:
  - transaction data
  - selected user role
- Derived dashboard metrics are computed using utility helpers in `src/utils/finance.js`.
- Transaction filtering and sorting are memoized inside `TransactionsSection.jsx` with `useMemo`.
- Transactions are persisted in `localStorage` so admin changes remain available after refresh.

This approach keeps the app simple and appropriate for the current project scope without introducing external state libraries.

## Setup Instructions

### Prerequisites

- Node.js
- npm

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Folder Structure

```text
finance-dashboard/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  ├─ ChartsSection.jsx
│  │  ├─ Header.jsx
│  │  ├─ InsightsPanel.jsx
│  │  ├─ RoleSwitcher.jsx
│  │  ├─ SummaryCard.jsx
│  │  └─ TransactionsSection.jsx
│  ├─ data/
│  │  └─ transactions.js
│  ├─ utils/
│  │  └─ finance.js
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ index.html
├─ package.json
├─ vite.config.js
└─ README.md
```

## Design Decisions

- Modular components:
  Each dashboard section is split into a dedicated component to keep rendering logic isolated and maintainable.

- Utility-driven calculations:
  Financial totals, chart data, and insight metrics are computed in `src/utils/finance.js` so UI components stay focused on presentation.

- Role behavior at the UI layer:
  Viewer and Admin permissions are demonstrated through conditional rendering without backend dependencies.

- Minimal but professional styling:
  Tailwind utility classes are used to keep the interface consistent, responsive, and easy to iterate on.

- Frontend-first data flow:
  Transactions are stored in React state and updated immediately for add/edit interactions, which keeps the prototype fast and easy to understand.

## Optional Enhancements Implemented

- `localStorage` persistence for transactions
- Hover states and transition polish across cards and panels
- Responsive mobile/desktop layouts for transactions and charts
- Empty-state messaging for charts, transactions, and insights

## Notes

- This project does not include backend integration.
- All add/edit transaction actions are frontend-only.
- Recharts increases the client bundle size, which currently triggers a non-blocking Vite chunk-size warning during production builds.
