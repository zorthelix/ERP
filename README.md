# Store Manager

Store Manager is a new, self-contained inventory and sales-management application built with **Node.js 20+**, **Express 5**, **PostgreSQL 18**, **pg**, **bcrypt**, **JWT**, **React**, **Vite**, **Axios**, and **Recharts**.
## Project tree

```text
store-manager/
├── backend/
│   ├── src/{config,controllers,middleware,routes}/
│   ├── tests/
│   ├── package.json
│   └── POSTMAN_TESTING.md
├── database/{schema.sql,seed.sql}
├── frontend/
│   ├── src/{components,pages,services}/
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
├── ideas.md
└── README.md
```

## Run locally

Create a PostgreSQL database named `store_manager`, then configure the database URL, JWT secret, port, and CORS origin in your local backend environment. Apply the supplied SQL:

```bash
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed.sql
```

Install and start the backend in one terminal:

```bash
cd backend
pnpm install
pnpm dev
```

In a second terminal, configure `VITE_API_URL=http://localhost:5000/api`, then start the React client:

```bash
cd frontend
pnpm install
pnpm dev
```

The API runs on `http://localhost:4000` and Vite serves the interface at `http://localhost:5173`. Run checks with `cd backend && pnpm test`. Use [`backend/POSTMAN_TESTING.md`](backend/POSTMAN_TESTING.md) to exercise every REST endpoint, including JWT protection, product CRUD, sales transactions, inventory updates, and reports.

## API summary

| Area | Endpoints |
|---|---|
| Authentication | `POST /api/auth/register`, `POST /api/auth/login` |
| Products | `POST`, `GET /api/products`; `PUT`, `DELETE /api/products/:id` |
| Sales | `POST`, `GET /api/sales` |
| Reports | `GET /api/reports/inventory`, `GET /api/reports/sales` |

All product, sales, and report routes require `Authorization: Bearer <token>`. Sales creation performs row-level inventory locks, validates available stock, inserts sales and sale items, updates inventory, and commits the operation in one PostgreSQL transaction.

