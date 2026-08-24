# Employee Leave Management System — Set C

ITUE301 Advanced Web Development Frameworks practical examination submission for roll number **24CE029**, batch **B1**.

This project is a React, Express, and MongoDB portal where employees can apply for leave and view their history, while authorised HR/manager users can review requests.

## Project structure

```text
frontend/                 React + Vite application
backend/                  Express + Mongoose REST API
docs/TASK_CHECKLIST.md    Requirement-by-requirement implementation map
docs/REPORT_CHECKLIST.md  Steps for the final Set C PDF report
postman/                  Importable API test collection
```

## Prerequisites

- Node.js 20 or newer
- npm
- MongoDB Atlas connection string (or a local MongoDB instance)

## Backend setup

```bash
cd backend
npm install
copy .env.example .env
```

Edit `backend/.env` and set `MONGO_URI` and a long, private `JWT_SECRET`. Then seed the required leave types and demo accounts:

```bash
npm run seed
npm start
```

The backend starts with `node server.js` through `npm start` and listens on `http://localhost:5000` by default.

Demo accounts created by the seed script:

| Role | Email | Default password |
|---|---|---|
| Employee | `employee@example.com` | `Password123!` |
| Manager | `manager@example.com` | `Password123!` |
| HR | `hr@example.com` | `Password123!` |

Set `SEED_PASSWORD` before running the seed script to use a different demo password.

## Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`. `VITE_API_URL` defaults to `http://localhost:5000/api/v1`.

## Tests and production build

```bash
cd backend
npm test

cd ../frontend
npm run build
```

## Required API endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Public | Authenticate and issue a JWT |
| GET | `/api/v1/leave-types` | Public | List leave types |
| POST | `/api/v1/leaves` | Authenticated | Apply for leave |
| GET | `/api/v1/leaves/my` | Authenticated | Get the signed-in employee's requests |
| GET | `/api/v1/leaves` | Manager/HR | Get all requests for review/reporting |
| PATCH | `/api/v1/leaves/:id/status` | Manager/HR | Approve or reject a request |

All private requests require this header:

```text
Authorization: Bearer <token>
```

## MongoDB and environment safety

The real `.env` is ignored by Git and must never be committed. Safe templates are provided in the repository root, `backend/.env.example`, and `frontend/.env.example`.

## Final submission

Submit both items required by the paper:

1. Public GitHub repository URL and final commit SHA.
2. `24CE029_SetC_Report.pdf` containing the three required screenshots.

The final line of the supplied paper mentions `SetA_Report.pdf`, but the assignment title and the earlier submission requirement both specify Set C. The Set C filename is therefore used here.
