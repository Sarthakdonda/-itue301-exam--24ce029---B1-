# `24CE029_SetC_Report.pdf` Preparation

The supplied paper requires three screenshots. Do not include the Atlas connection string, JWT secret, database password, or full Bearer token in any screenshot.

## Before taking screenshots

1. Run `npm run seed` and `npm start` inside `/backend`.
2. Run `npm run dev` inside `/frontend`.
3. Import the collection from `/postman` and run `Login - Employee`.
4. Run `List Leave Types`, copy one `_id`, and set the collection variable `leaveTypeId`.
5. Run `Create Leave - 201`; its test script stores the created `leaveId`.
6. Sign in to the website as `hr@example.com`, approve or reject the pending request, then sign back in as the employee.

## Required screenshot 1 — MyLeavesPage

- Show the heading `Welcome, Aarav Employee`.
- Show one or more cards with dates, days, leave type, reason, and a coloured status badge.
- Keep the status filter visible.
- Avoid showing browser extensions or unrelated private information.

## Required screenshot 2 — Postman HTTP 201

- Show `POST /api/v1/leaves`.
- Show the request body fields: `leaveTypeId`, `fromDate`, `toDate`, and `reason`.
- Show response status `201 Created` and the structured JSON response.
- Hide the Bearer token before capturing if Postman displays it.

## Required screenshot 3 — MongoDB document

- Open database `itue301_leave_management`.
- Open collection `leaverequests`.
- Show a saved document with `employeeId`, `leaveTypeId`, dates, days, reason, and status.
- Do not show the database URI or user credentials.

## Suggested report layout

1. Cover: `ITUE301 Practical Examination — Set C`, `24CE029`, `B1`, repository URL, final commit SHA.
2. Screenshot 1 with caption: `React MyLeavesPage rendering API data through LeaveRequestCard`.
3. Screenshot 2 with caption: `POST /api/v1/leaves returns HTTP 201`.
4. Screenshot 3 with caption: `Saved LeaveRequest document in MongoDB Atlas`.
5. Short conclusion listing React, Express, JWT middleware, and Mongoose validation.

The paper's final sentence says `SetA_Report.pdf`, but the Set C heading and the earlier explicit filename rule say `[RollNo]_SetC_Report.pdf`. Use `24CE029_SetC_Report.pdf` unless faculty provides a correction.
