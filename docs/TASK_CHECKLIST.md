# Set C Task Checklist

This checklist maps every requirement from the supplied examination PDF to the implementation.

## General and submission requirements

- [x] React frontend in `/frontend`.
- [x] Express backend in `/backend`.
- [x] MongoDB access uses Mongoose only.
- [x] Backend starts with `node server.js` or `npm start`.
- [x] Real MongoDB connection string and port are stored in ignored `backend/.env`.
- [x] Safe `.env.example` files are committed.
- [x] README includes project name, frontend/backend instructions, and MongoDB setup.
- [ ] Public GitHub URL and final commit SHA submitted to the faculty form.
- [ ] `24CE029_SetC_Report.pdf` completed with all required screenshots and submitted.

## Task 1 — React Component Architecture (4 marks)

- [x] `LoginPage` is implemented.
- [x] `ApplyLeavePage` is implemented.
- [x] `MyLeavesPage` is implemented.
- [x] Reusable `LeaveRequestCard` is inside `/src/components`.
- [x] `LeaveRequestCard` accepts `fromDate`, `toDate`, `days`, `leaveType`, `reason`, and `status` props.
- [x] All six prop values are displayed.
- [x] Status is displayed as a coloured pill: yellow pending, green approved, red rejected, grey cancelled.
- [x] Parent pages pass API leave data into the reusable card.

## Task 2 — React Routing and State Management (4 marks)

- [x] `/` renders `LoginPage`.
- [x] `/apply` renders protected `ApplyLeavePage`.
- [x] `/my-leaves` renders protected `MyLeavesPage`.
- [x] `/hr` lazy-loads `HRPanel` with `React.lazy` and `Suspense`.
- [x] `/hr` renders only when `role === 'hr'`.
- [x] Navigation uses React Router `NavLink` links without full-page reloads.
- [x] Apply form includes leave type, from date, to date, and reason.
- [x] Form fields use `useState`.
- [x] Computed inclusive leave days use a separate meaningful state value.
- [x] `AuthContext` exposes `{ employee, token, role, login, logout }`.
- [x] `MyLeavesPage` reads auth context and displays `Welcome, [Name]`.

## Task 3 — Express REST API and Middleware (4 marks)

- [x] `POST /api/v1/auth/login` authenticates an employee and issues a JWT.
- [x] `GET /api/v1/leave-types` returns all leave types publicly.
- [x] `POST /api/v1/leaves` creates a protected leave request.
- [x] `GET /api/v1/leaves/my` returns the authenticated employee's requests.
- [x] `PATCH /api/v1/leaves/:id/status` approves/rejects a request for manager/HR roles.
- [x] Extra `GET /api/v1/leaves` endpoint supports HR review and reporting.
- [x] Global `requestLogger` logs `[METHOD] [PATH] [TIMESTAMP]`.
- [x] `authGuard` checks a Bearer JWT and returns 401 for missing/invalid tokens.
- [x] Only login and the leave-type listing are public.
- [x] Status update accepts only `approved` or `rejected`.
- [x] Global final error middleware returns structured JSON without a raw stack.
- [x] Controllers use appropriate 200, 201, 400, 401, and 500 status handling.
- [x] Importable Postman collection is provided in `/postman`.

## Task 4 — REST API Consumption in React (4 marks)

- [x] `MyLeavesPage` calls `GET /api/v1/leaves/my` from `useEffect` on mount.
- [x] Request sends `Authorization: Bearer <token>`.
- [x] Separate `leaves`, `loading`, and `error` states are maintained.
- [x] A loading indicator is shown while fetching.
- [x] A non-200/API failure displays exactly `Failed to load your leave history.`.
- [x] Successful API data is rendered with `LeaveRequestCard`; no leaves are hardcoded.
- [x] All/Pending/Approved/Rejected dropdown filters the already-fetched array without another request.

## Task 5 — MongoDB, Mongoose, and Validation (4 marks)

- [x] `Employee` schema: required name/email/department/designation/password hash, unique email, balance default 20/min 0, role enum.
- [x] `LeaveType` schema: required name enum and required `maxDaysPerYear` with min 1.
- [x] `LeaveRequest` schema: required references/dates/days/reason, days min 1, reason max 500, required status enum/default pending.
- [x] Leave type enum is exactly Casual, Sick, Earned, CompOff.
- [x] Request status enum is exactly pending, approved, rejected, cancelled.
- [x] Mongoose refs connect `employeeId → Employee` and `leaveTypeId → LeaveType`.
- [x] Leave creation checks `days <= employee.leaveBalance` and returns 400 if exceeded.
- [x] Successful leave creation deducts the employee's balance.
- [x] Rejection refunds days that were reserved when the request was created.
- [x] `GET /leaves/my` uses `.populate('leaveTypeId', 'name maxDaysPerYear')`.
- [x] MongoDB connection comes only from `MONGO_URI` in `.env`.
- [x] Model tests demonstrate meaningful validation failures without exposing raw Mongoose errors.

## Required evidence still produced at final run

1. My Leaves page showing real API-backed cards and coloured status badges.
2. Postman showing HTTP 201 for leave creation.
3. MongoDB Atlas/Compass showing a saved `leaverequests` document in `itue301_leave_management`.
