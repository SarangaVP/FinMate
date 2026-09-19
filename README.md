# FinMate

FinMate is a full-stack personal finance and shared expense management application designed to help users track money, plan budgets, stay on top of recurring payments, and collaborate on shared household or group expenses.

The project combines a Node.js/Express backend with MongoDB and a React + Vite frontend, and includes AI-assisted transaction categorization using Google Gemini.

## Overview

FinMate is built for everyday financial awareness and planning. It helps users:

- Track income and expenses with transaction history
- Automatically categorize spending with AI-powered analysis
- Monitor budgets and savings goals
- Manage recurring payments and upcoming due dates
- View six-month analytics and spending insights
- Manage shared finances with groups and expense settlements
- Keep all financial data organized in a single dashboard experience

This repository contains both the API server and the web app frontend in separate folders:

- `backend/` — Express API, MongoDB integration, JWT auth, AI categorization
- `frontend/finmate-fe/` — React application for interacting with the system

## Core Features

### 1. Personal finance tracking
- Add, edit, and delete income and expense transactions
- Search and filter transactions by type, category, and date range
- See current balance, total income, and total expenses from the dashboard

### 2. AI-assisted categorization
- Transaction descriptions are analyzed using Google Gemini
- Spending categories such as Food, Transport, Utilities, or other labels are inferred automatically
- If AI analysis fails or no category is detected, the app falls back to `Uncategorized`

### 3. Budget and savings management
- Create and manage spending budgets by category
- Track current spending against budget limits
- Set savings goals and contribute toward them over time
- Surface budget alerts when spending reaches critical thresholds

### 4. Recurring payments
- Add payments that recur on a schedule
- Track next due dates and upcoming due items
- Mark recurring payments as paid when they are settled

### 5. Shared groups and bill splitting
- Create finance groups with multiple members
- Add shared expenses and track who owes what
- Calculate member balances and settlement activity
- Pay outstanding settlements between group members

### 6. Reports and analytics
- Analyze spending by category
- Review income vs expense trends over the last six months
- Download report summaries as CSV
- View top spending categories and expensive dates highlighted in the dashboard

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- dotenv for environment config
- CORS for browser API access
- Google GenAI SDK for Gemini-based transaction analysis

### Frontend
- React 19
- Vite
- React Router
- Axios for API calls
- Tailwind CSS for styling
- Lucide React icons

## Architecture

The app follows a straightforward client-server pattern:

- The frontend runs as a Vite React SPA and communicates with the API over `http://localhost:5000/api`
- The backend exposes REST endpoints for authentication, transactions, budgets/goals, reports, recurring payments, and shared groups
- JWT-protected routes verify access tokens on each request
- MongoDB stores users, transactions, recurring items, budgets, savings goals, and shared group records
- AI categorization is performed when creating transactions and can enrich the category metadata automatically

## Repository Layout

```text
FinMate/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── ...
├── frontend/
│   └── finmate-fe/
│       ├── src/
│       ├── public/
│       ├── package.json
│       ├── vite.config.js
│       └── ...
├── README.md
└── .gitignore
```

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 18+ or later
- npm
- MongoDB Atlas connection string or a local MongoDB instance
- A Google Gemini API key
- A terminal with access to both backend and frontend commands

## Environment Variables

The backend uses environment variables from a `.env` file.

Create a `.env` file in the `backend/` directory using the example below:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
GEMINI_API_KEY=your_google_gemini_api_key_here
JWT_SECRET=replace_this_with_a_long_random_secret
```

You can also use the included template:

```bash
cp backend/.env.example backend/.env
```

Important:
- Do not commit real secrets to version control
- Keep your `.env` file local and private
- Use a strong random value for `JWT_SECRET`

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/SarangaVP/FinMate.git
cd FinMate
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend/finmate-fe
npm install
```

### 4. Start the backend

From the `backend/` folder:

```bash
npm run dev
```

This starts the Express API on:

- `http://localhost:5000`

### 5. Start the frontend

From the `frontend/finmate-fe/` folder:

```bash
npm run dev
```

This starts the Vite development server, usually on:

- `http://localhost:5173`

## Application URLs

After running both services:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Backend health check: `http://localhost:5000/`

## Authentication Flow

The app uses JWT-based authentication.

- Users register or log in through the frontend auth screen
- The backend validates email/password and returns a JWT token
- The token is stored in `localStorage`
- Protected API routes require a `Bearer` token in the `Authorization` header
- Expired or invalid tokens trigger a 401 and redirect the user back to the app login state

## Main API Areas

The backend organizes functionality into the following route groups:

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Transactions
- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `GET /api/transactions/summary`

### Planning and goals
- `GET /api/planning/budgets`
- `POST /api/planning/budgets`
- `PUT /api/planning/budgets/:id`
- `DELETE /api/planning/budgets/:id`
- `GET /api/planning/goals`
- `POST /api/planning/goals`
- `PUT /api/planning/goals/:id`
- `PUT /api/planning/goals/:id/contribute`
- `DELETE /api/planning/goals/:id`

### Recurring payments
- `GET /api/recurring`
- `POST /api/recurring`
- `PUT /api/recurring/:id`
- `DELETE /api/recurring/:id`
- `POST /api/recurring/:id/pay`

### Reports
- `GET /api/reports/analytics?months=6`

### Shared groups
- `GET /api/shared-groups`
- `GET /api/shared-groups/:id`
- `GET /api/shared-groups/:id/balances`
- `POST /api/shared-groups`
- `POST /api/shared-groups/join`
- `POST /api/shared-groups/add-member`
- `DELETE /api/shared-groups/remove-member`
- `PUT /api/shared-groups/:id`
- `POST /api/shared-groups/:id/settle`
- `DELETE /api/shared-groups/:id`

### Shared expenses
- `GET /api/shared-expenses/group/:groupID`
- `GET /api/shared-expenses/:id`
- `GET /api/shared-expenses/balance/:groupID`
- `POST /api/shared-expenses`
- `PUT /api/shared-expenses/:id`
- `DELETE /api/shared-expenses/:id`
- `POST /api/shared-expenses/settlement/:settlementId/pay`

## User Experience Flow

A typical FinMate workflow looks like this:

1. Register or log in
2. Add transactions for income and spending
3. Review dashboard data and AI-inferred categories
4. Set budget limits and savings goals
5. Add recurring bills and upcoming expenses
6. Explore analytics and six-month trends
7. Create or join shared groups for joint finances
8. Add shared expenses and settle balances with other members

## Notes on Real Behavior in This Project

This repository is a development/local application setup, not a production deployment template. Some behaviors are dependent on:

- a valid MongoDB Atlas or MongoDB instance
- a valid Google Gemini API key
- local frontend/backend service URLs matching the expected defaults
- the frontend communicating with the backend on `http://localhost:5000/api`

The app also includes automatic refresh events for dashboard and financial summary widgets after transactions or balance-affecting updates occur.

## Security Notes

- Never expose your `.env` file or credentials in public repositories
- Keep `JWT_SECRET` unique and strong
- Do not commit real MongoDB connection strings or API keys
- Prefer environment-based configuration for all secrets


## Conclusion

FinMate is a practical finance dashboard for managing everyday money, planning for the future, and coordinating shared spending with the people you live or work with. It brings together personal tracking, AI insights, recurring payment management, and collaborative household finance in one streamlined experience.
